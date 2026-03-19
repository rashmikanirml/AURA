import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SellForm } from "@/app/components/sell-form";
import { authOptions } from "@/lib/auth";

export default async function SellPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return <SellForm />;
}
