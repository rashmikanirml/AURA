import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(20),
});

type ChatMessage = z.infer<typeof messageSchema>;

function extractBudget(text: string) {
  const matches = text.match(/(?:\$|€|£|₹|Rs\.?\s?)?\s?([0-9][0-9,\.]{3,})/g);
  if (!matches?.length) return null;

  const numeric = matches
    .map((value) => Number(value.replace(/[^0-9]/g, "")))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (!numeric.length) return null;
  return Math.max(...numeric);
}

function detectLanguage(text: string) {
  if (/[\u0600-\u06FF]/.test(text)) return "ur";
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  if (/[\u0400-\u04FF]/.test(text)) return "ru";
  if (/[\u4E00-\u9FFF]/.test(text)) return "zh";
  if (/[\u3040-\u30FF]/.test(text)) return "ja";
  if (/[\uAC00-\uD7AF]/.test(text)) return "ko";
  if (/[\u00C0-\u024F]/.test(text) || /(\bhola\b|\bgracias\b|\bpor favor\b)/i.test(text)) return "es";
  return "en";
}

function buildFallbackReply(userMessage: string) {
  const budget = extractBudget(userMessage);
  const lc = userMessage.toLowerCase();

  const wants = {
    suv: /(suv|crossover|4x4|jeep|جیپ|एसयूवी|sporte?age|tucson)/i.test(lc),
    sedan: /(sedan|saloon|civic|corolla|سیڈان|सेडान)/i.test(lc),
    economy: /(economy|fuel|mileage|cheap|budget|کم خرچ|सस्ता|economico)/i.test(lc),
    family: /(family|kids|space|7 seater|familia|family car|خاندان|परिवार)/i.test(lc),
  };

  const picks = [];

  if (wants.suv || wants.family) {
    picks.push("Kia Sportage AWD", "Honda BR-V i-VTEC S", "Hyundai Tucson GLS AWD");
  }

  if (wants.sedan) {
    picks.push("Toyota Corolla Altis 1.8 G", "Honda Civic Oriel 1.8 i-VTEC", "Hyundai Elantra GLS");
  }

  if (wants.economy || picks.length === 0) {
    picks.push("Suzuki Wagon R VXL", "Toyota Yaris ATIV X CVT", "Changan Alsvin Lumiere");
  }

  const uniquePicks = Array.from(new Set(picks)).slice(0, 4);
  const budgetLine = budget
    ? `- Budget matched around ${budget.toLocaleString()} (approx).`
    : "- I could not detect a clear budget; share your max budget for better matches.";

  const detectedLang = detectLanguage(userMessage);

  if (detectedLang === "ur") {
    return [
      "بالکل! آپ کی ضرورت کے مطابق یہ گاڑیاں بہتر رہیں گی:",
      ...uniquePicks.map((name) => `- ${name}`),
      budgetLine,
      "- بہتر مشورے کے لئے بتائیں: شہر، فیول پسند (پیٹرول/ہائبرڈ)، اور روزانہ کتنا سفر کرتے ہیں؟",
      "نوٹ: مکمل AI جو کسی بھی زبان میں زیادہ بہتر جواب دے، اس کے لئے OPENAI_API_KEY سیٹ کریں۔",
    ].join("\n");
  }

  if (detectedLang === "hi") {
    return [
      "बिलकुल, आपकी जरूरत के अनुसार ये गाड़ियां अच्छी रहेंगी:",
      ...uniquePicks.map((name) => `- ${name}`),
      budgetLine,
      "- और बेहतर सुझाव के लिए बताएं: शहर, ईंधन पसंद (पेट्रोल/हाइब्रिड), और रोज़ का ड्राइव कितना है?",
      "नोट: किसी भी भाषा में बेहतर AI जवाब के लिए OPENAI_API_KEY सेट करें।",
    ].join("\n");
  }

  return [
    "Great question. Based on your preference, these are strong options:",
    ...uniquePicks.map((name) => `- ${name}`),
    budgetLine,
    "- For a tighter recommendation, share city, monthly fuel budget, and whether you prefer sedan or SUV.",
    "Note: For richer multilingual AI responses, set OPENAI_API_KEY on the server.",
  ].join("\n");
}

function extractResponseText(payload: unknown) {
  if (!payload || typeof payload !== "object") return null;

  const direct = (payload as { output_text?: unknown }).output_text;
  if (typeof direct === "string" && direct.trim()) {
    return direct.trim();
  }

  const output = (payload as { output?: unknown }).output;
  if (!Array.isArray(output)) return null;

  const chunks: string[] = [];

  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) continue;

    for (const block of content) {
      if (!block || typeof block !== "object") continue;
      const text = (block as { text?: unknown }).text;
      if (typeof text === "string" && text.trim()) {
        chunks.push(text.trim());
      }
    }
  }

  return chunks.length ? chunks.join("\n\n") : null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const messages = parsed.data.messages;
    const userMessage = [...messages].reverse().find((entry) => entry.role === "user")?.content;

    if (!userMessage) {
      return NextResponse.json({ error: "A user message is required." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: buildFallbackReply(userMessage),
        source: "fallback",
      });
    }

    const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

    const promptMessages = [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: [
              "You are AURA Car Advisor, an expert auto-buying assistant.",
              "Understand user intent in any language and ALWAYS reply in the same language as the latest user message.",
              "Ask at most 2 clarifying questions when information is missing.",
              "Recommend 3-5 cars with concise reasons, budget fit, and use-case fit.",
              "Prefer practical, realistic advice and clear next-step questions.",
              "Keep answers scannable with short bullets.",
            ].join(" "),
          },
        ],
      },
      ...messages.map((message: ChatMessage) => ({
        role: message.role,
        content: [{ type: "input_text", text: message.content }],
      })),
    ];

    const aiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: promptMessages,
        temperature: 0.7,
        max_output_tokens: 500,
      }),
    });

    if (!aiResponse.ok) {
      return NextResponse.json({
        reply: buildFallbackReply(userMessage),
        source: "fallback",
      });
    }

    const responsePayload = await aiResponse.json();
    const aiText = extractResponseText(responsePayload);

    if (!aiText) {
      return NextResponse.json({
        reply: buildFallbackReply(userMessage),
        source: "fallback",
      });
    }

    return NextResponse.json({ reply: aiText, source: "openai" });
  } catch {
    return NextResponse.json(
      {
        error: "Unable to process request.",
      },
      { status: 500 },
    );
  }
}
