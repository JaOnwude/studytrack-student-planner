"use client";

import { useActionState } from "react";
import { registerUser, type FormState } from "@/app/(auth)/actions";
import { FormField } from "./form-field";
import { SubmitButton } from "./submit-button";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(registerUser, {});

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {state.message && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.message}
        </p>
      )}
      <FormField id="name" label="Name" autoComplete="name" defaultValue={state.values?.name} errors={state.fieldErrors?.name} />
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
        autoComplete="new-password"
        hint="At least 8 characters."
        errors={state.fieldErrors?.password}
      />
      <SubmitButton pending={pending} label="Create account" pendingLabel="Creating account…" />
    </form>
  );
}
