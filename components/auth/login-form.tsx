"use client";

import { useActionState } from "react";
import { loginUser, type FormState } from "@/app/(auth)/actions";
import { FormField } from "./form-field";
import { SubmitButton } from "./submit-button";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(loginUser, {});

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {state.message && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.message}
        </p>
      )}
      <FormField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        defaultValue={state.values?.email}
        errors={state.fieldErrors?.email}
      />
      <FormField
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        errors={state.fieldErrors?.password}
      />
      <SubmitButton pending={pending} label="Log in" pendingLabel="Logging in…" />
    </form>
  );
}
