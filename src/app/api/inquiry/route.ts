import { NextResponse } from "next/server";
import { z } from "zod";

import { inquiryHtml, inquirySubject, inquiryText } from "@/lib/inquiry-email";
import { inquirySchema } from "@/lib/schemas/inquiry";
import { site } from "@/content/site";

/**
 * Inquiry endpoint.
 *
 * Validation runs here as well as in the browser, and that is not redundant —
 * the client check is a UX affordance, and anything can POST to this route.
 *
 * Delivery goes out through Resend in `dispatch`. Swapping destinations is a
 * change to that function and nothing else — the route contract is unaffected.
 */

export const runtime = "nodejs";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/**
 * Delivers a validated inquiry to the studio inbox via Resend.
 *
 * Both addresses are environment-driven so the destination can change without
 * a deploy of new code. `INQUIRY_FROM` must be on a domain verified in Resend —
 * until pixelportal.in is verified, Resend's shared `onboarding@resend.dev`
 * sender works but will only deliver to the Resend account owner.
 *
 * Throwing here is deliberate. The caller turns a throw into a 502 telling the
 * visitor to email us directly, which is the honest outcome: their message was
 * accepted by the form but never reached anyone.
 */
async function dispatch(inquiry: z.infer<typeof inquirySchema>) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Local development without a key should not be a dead end — log the
    // inquiry and carry on. In production a missing key is a real outage, and
    // silently dropping a lead would be far worse than showing an error.
    if (process.env.NODE_ENV !== "production") {
      console.info("[inquiry] no RESEND_API_KEY; logging instead of sending", inquiry);
      return;
    }
    throw new Error("RESEND_API_KEY is not set.");
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.INQUIRY_FROM ?? "Pixel Portal <onboarding@resend.dev>",
      to: [process.env.INQUIRY_TO ?? site.email],
      // The visitor's own address, so hitting reply in the inbox answers them
      // directly rather than starting a fresh mail.
      reply_to: inquiry.email,
      subject: inquirySubject(inquiry),
      text: inquiryText(inquiry),
      html: inquiryHtml(inquiry),
    }),
  });

  if (!response.ok) {
    // Resend explains refusals (unverified domain, bad key) in the body, and
    // that detail is what makes the server log worth reading.
    throw new Error(`Resend refused the message (${response.status}): ${await response.text()}`);
  }
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
