import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(100, "Name must be 100 characters or fewer."),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.")),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be 72 characters or fewer."),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.")),
  password: z.string().min(1, "Enter your password."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

const assignmentFields = {
  title: z.string().trim().min(1, "Enter an assignment title.").max(200, "Title must be 200 characters or fewer."),
  description: z.string().trim().max(2000, "Description must be 2000 characters or fewer."),
  dueDate: z.iso.date("Enter a valid due date."),
  status: z.enum(["PENDING", "COMPLETED"]),
};

export const assignmentSchema = z.object({
  ...assignmentFields,
  description: assignmentFields.description.optional().default(""),
  status: assignmentFields.status.optional(),
});

// For edits: any subset of the fields (no defaults, so unsent fields stay unchanged),
// but at least one.
export const assignmentUpdateSchema = z
  .object(assignmentFields)
  .partial()
  .refine((value) => Object.values(value).some((v) => v !== undefined), "Nothing to update.");

export type AssignmentInput = z.infer<typeof assignmentSchema>;
export type AssignmentUpdate = z.infer<typeof assignmentUpdateSchema>;
