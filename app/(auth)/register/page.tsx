import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account | StudyTrack",
};

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Keep your assignments, study sessions, and deadlines in one place."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-700 underline-offset-2 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
