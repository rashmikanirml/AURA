import Link from "next/link";
import { LoginForm } from "@/app/components/login-form";

export default function LoginPage() {
  return (
    <section className="mx-auto w-full max-w-md space-y-4">
      <LoginForm />
      <p className="text-center text-sm text-muted">
        New user?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Create account
        </Link>
      </p>
    </section>
  );
}
