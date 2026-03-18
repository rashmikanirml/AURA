import Link from "next/link";
import { RegisterForm } from "@/app/components/register-form";

export default function RegisterPage() {
  return (
    <section className="mx-auto w-full max-w-md space-y-4">
      <RegisterForm />
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Login
        </Link>
      </p>
    </section>
  );
}
