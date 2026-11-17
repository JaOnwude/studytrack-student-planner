type FormFieldProps = {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  defaultValue?: string;
  errors?: string[];
  hint?: string;
};

export function FormField({ id, label, type = "text", autoComplete, defaultValue, errors, hint }: FormFieldProps) {
  const hasError = Boolean(errors?.length);
  const describedBy = [hint && `${id}-hint`, hasError && `${id}-error`].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-800">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        required
        aria-invalid={hasError}
        aria-describedby={describedBy}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-base text-slate-900 shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 ${
          hasError ? "border-red-600" : "border-slate-300 focus-visible:border-blue-600"
        }`}
      />
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-slate-600">
          {hint}
        </p>
      )}
      {hasError && (
        <p id={`${id}-error`} className="text-sm text-red-700">
          {errors!.join(" ")}
        </p>
      )}
    </div>
  );
}
