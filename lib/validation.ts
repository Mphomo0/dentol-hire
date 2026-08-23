import { z } from "zod";

export const categoryEnum = z.enum([
  "tools",
  "equipment",
  "machinery",
  "trailers",
]);

export const quoteRequestSchema = z.object({
  name: z
    .string()
    .min(2, "Please enter your full name")
    .max(80, "Name is too long"),
  company: z.string().max(100, "Company name is too long").optional().or(z.literal("")),
  email: z.email("Enter a valid email address"),
  phone: z
    .string()
    .min(9, "Enter a valid contact number")
    .max(20, "Number is too long")
    .regex(/^[0-9+()\s-]+$/, "Digits, spaces and + only"),
  interests: z
    .array(categoryEnum)
    .min(1, "Select at least one category"),
  itemNotes: z
    .string()
    .min(10, "Tell us what you need (at least 10 characters)")
    .max(600, "Keep it under 600 characters"),
  startDate: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), "Pick a valid date")
    .refine(
      (v) => new Date(v).getTime() >= Date.now() - 86_400_000,
      "Start date can't be in the past"
    ),
  durationDays: z
    .number({ message: "Enter the number of days" })
    .int("Whole days only")
    .min(1, "Minimum 1 day")
    .max(365, "Give us a call for hires longer than a year"),
  message: z.string().max(600, "Keep it under 600 characters").optional().or(z.literal("")),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your full name").max(80, "Name is too long"),
  email: z.email("Enter a valid email address"),
  phone: z
    .string()
    .min(9, "Enter a valid contact number")
    .max(20, "Number is too long")
    .regex(/^[0-9+()\s-]+$/, "Digits, spaces and + only"),
  subject: z.enum(["general", "booking", "accounts", "careers"], {
    message: "Pick a subject",
  }),
  message: z
    .string()
    .min(10, "Tell us a bit more (at least 10 characters)")
    .max(1000, "Keep it under 1 000 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;
