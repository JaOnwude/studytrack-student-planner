import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in | StudyTrack",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to see your planner."
      footer={
        <>
          New to StudyTrack?{" "}
          <Link href="/register" className="font-semibold text-blue-700 underline-offset-2 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
