import { z } from "zod";

/**
 * Inquiry schema — imported by both the stepper and the route handler.
 *
 * One schema for both sides is the point: per-step client validation and the
 * server's final check can never disagree about what a valid inquiry is, and
 * adding a field cannot leave the server accepting something the form would
 * have rejected.
 *
 * Zod v4 API: top-level `z.email()` / `z.url()`, and `error` (not `message`)
 * for custom messages.
 */

export const BUDGETS = [
  "Under $10k",
  "$10k – $25k",
  "$25k – $50k",
  "$50k – $100k",
  "$100k+",
  "Not sure yet",
] as const;

export const TIMELINES = [
  "As soon as possible",
  "Within 1–3 months",
  "Within 3–6 months",
  "Exploring for later",
] as const;

/**
 * Schema-level `error` supplies the message when a field is missing or the
 * wrong type; the per-check `error` overrides it for that specific rule.
 * Without the outer one, an absent field surfaces Zod's internal wording
 * ("Invalid input: expected string, received undefined") to the caller.
 */
export const inquirySchema = z.object({
  services: z
    .array(z.string(), { error: "Pick at least one service so we can route this correctly." })
    .min(1, { error: "Pick at least one service so we can route this correctly." }),

  scope: z
    .string({ error: "Tell us a little about the project." })
    .trim()
    .min(20, { error: "A sentence or two, please — at least 20 characters." })
    .max(4000, { error: "That is longer than this form can take. Email us instead." }),

  // Optional, but must be a real URL when supplied. An empty string is the
  // natural value of an untouched input, so it has to be accepted explicitly.
  website: z
    .union([z.url({ error: "That does not look like a valid URL." }), z.literal("")])
    .optional(),

  budget: z.enum(BUDGETS, { error: "Choose a budget range." }),
  timeline: z.enum(TIMELINES, { error: "Choose a timeline." }),

  name: z
    .string({ error: "Please tell us your name." })
    .trim()
    .min(2, { error: "Please tell us your name." }),
  email: z.email({ error: "We need a valid email to reply to." }),
  company: z
    .string({ error: "Which company are you with?" })
    .trim()
    .min(1, { error: "Which company are you with?" }),
  phone: z.string().trim().max(40).optional(),
});

export type Inquiry = z.infer<typeof inquirySchema>;

/**
 * Field groups per step. The stepper validates only the current step's fields
 * by picking them off the shared schema, so "next" is blocked by the same
 * rules the server will apply at the end.
 */
export const STEP_FIELDS = [
  ["services"],
  ["scope", "website"],
  ["budget", "timeline"],
  ["name", "email", "company", "phone"],
] as const satisfies readonly (readonly (keyof Inquiry)[])[];

export type FieldErrors = Partial<Record<keyof Inquiry, string[]>>;

/** Validate one step. Returns field errors keyed exactly as the form state is. */
export function validateStep(step: number, data: Partial<Inquiry>): FieldErrors {
  const fields = STEP_FIELDS[step];
  if (!fields) return {};

  const mask = Object.fromEntries(fields.map((field) => [field, true]));
  const partial = inquirySchema.pick(mask as never);
  const result = partial.safeParse(data);

  if (result.success) return {};
  return z.flattenError(result.error).fieldErrors as FieldErrors;
}
