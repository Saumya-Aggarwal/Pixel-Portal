import { NextResponse } from "next/server";
import { z } from "zod";

import { inquirySchema } from "@/lib/schemas/inquiry";

/**
 * Inquiry endpoint.
 *
 * Validation runs here as well as in the browser, and that is not redundant —
 * the client check is a UX affordance, and anything can POST to this route.
 *
 * Delivery is intentionally stubbed. The stepper already exercises the real
 * pending, success, and field-error paths against this handler, so wiring a
 * destination later is a change to `dispatch` and nothing else.
 */

export const runtime = "nodejs";

async function dispatch(inquiry: z.infer<typeof inquirySchema>) {
  // TODO: replace with the chosen destination — Resend, Zoho CRM Leads, or a
  // webhook. Keep the signature; the route contract should not change.
  console.info("[inquiry] received", {
    name: inquiry.name,
    email: inquiry.email,
    company: inquiry.company,
    services: inquiry.services,
    budget: inquiry.budget,
    timeline: inquiry.timeline,
    scopeLength: inquiry.scope.length,
  });
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Expected a JSON body." },
      { status: 400 },
    );
  }

  const result = inquirySchema.safeParse(payload);

  if (!result.success) {
    const { fieldErrors, formErrors } = z.flattenError(result.error);
    return NextResponse.json(
      { ok: false, error: "Validation failed.", fieldErrors, formErrors },
      { status: 400 },
    );
  }

  try {
    await dispatch(result.data);
  } catch (error) {
    // The submission was valid; delivery is what failed. Say so, rather than
    // reporting a 400 that would send the visitor back to edit a correct form.
    console.error("[inquiry] dispatch failed", error);
    return NextResponse.json(
      { ok: false, error: "We could not deliver your enquiry. Please email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
