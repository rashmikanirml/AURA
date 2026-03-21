"use client";

import { FormEvent, useMemo, useState } from "react";
import { Car, MessageCircle, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

const starterMessage: ChatMessage = {
  role: "assistant",
  content:
    "Tell me your budget, preferred body type, fuel preference, and city. I will suggest the best cars for you in your language.",
};

const quickPrompts = [
  "I need a fuel-efficient car under 30 lakh for Lahore",
  "Mujhe Karachi ke liye family SUV chahiye budget 60 lakh",
  "Necesito un sedan economico para ciudad con poco consumo",
];

export function AICarChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

  async function submitMessage(content: string) {
    const text = content.trim();
    if (!text || isSending) return;

    setError(null);
    const nextMessages = [...messages, { role: "user", content: text } as ChatMessage];

    setMessages(nextMessages);
    setDraft("");
    setIsSending(true);

    try {
      const response = await fetch("/api/ai-car-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok) {
        setError("Assistant is temporarily unavailable. Please try again.");
        return;
      }

      const data = (await response.json()) as { reply?: string };
      const reply = data.reply;

      if (!reply) {
        setError("No response was generated. Please retry.");
        return;
      }

      setMessages((current) => [...current, { role: "assistant", content: reply }]);
    } catch {
      setError("Network issue while contacting assistant. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitMessage(draft);
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 sm:bottom-6 sm:right-6">
      {isOpen ? (
        <section className="w-[calc(100vw-2rem)] max-w-md rounded-2xl border border-border bg-white shadow-2xl">
          <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Car className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-base font-semibold tracking-tight">AI Car Advisor</h2>
                <p className="text-xs text-muted">Ask in any language.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="rounded-md p-1 text-muted transition hover:bg-slate-100 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setDraft(prompt)}
                  className="rounded-full border border-border bg-slate-50 px-3 py-1 text-xs text-foreground transition hover:bg-slate-100"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="max-h-80 space-y-2 overflow-y-auto rounded-lg border border-border bg-slate-50 p-3">
              {hasMessages ? (
                messages.map((message, index) => (
                  <article
                    key={`${message.role}-${index}`}
                    className={
                      message.role === "user"
                        ? "ml-auto max-w-[90%] rounded-xl bg-primary px-3 py-2 text-sm text-primary-foreground"
                        : "mr-auto max-w-[90%] rounded-xl border border-border bg-white px-3 py-2 text-sm text-foreground"
                    }
                  >
                    <p className="whitespace-pre-wrap leading-6">{message.content}</p>
                  </article>
                ))
              ) : (
                <p className="text-sm text-muted">Start the conversation to get recommendations.</p>
              )}

              {isSending ? (
                <div className="mr-auto max-w-[90%] rounded-xl border border-border bg-white px-3 py-2 text-sm text-muted">
                  Thinking...
                </div>
              ) : null}
            </div>

            <form onSubmit={handleSubmit} className="mt-3 space-y-2">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Example: Need a family SUV under 70 lakh in Islamabad"
                className="min-h-24 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none ring-primary/25 transition focus:ring"
              />
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <div className="flex justify-end">
                <Button type="submit" disabled={isSending || !draft.trim()}>
                  {isSending ? "Thinking..." : "Ask AI Advisor"}
                </Button>
              </div>
            </form>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:brightness-95"
          aria-label="Open AI car advisor chat"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-foreground/15">
            <Car className="h-4 w-4" />
          </span>
          <span>AI Car Chat</span>
          <MessageCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
