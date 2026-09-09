import type { Inquiry } from "@/lib/schemas/inquiry";

/**
 * Renders an inquiry as the email that lands in the studio inbox.
 *
 * Kept apart from the route handler because the two change for different
 * reasons: the handler owns validation and transport failure, this owns what
 * the message looks like. Editing the wording should never risk the contract.
 *
 * Both a text and an HTML part are produced. The text part is not a courtesy —
 * a mail client that renders only HTML is rare, but spam filters score a
 * multipart message better than an HTML-only one, and this mail must not land
 * in spam.
 */

/**
 * Escapes the four characters that can break out of HTML text content.
 *
 * Every value below is typed by a stranger on the public internet, so none of
 * it is interpolated raw. Zod validated the *shape* of these fields; it made no
 * claim about their contents being safe to render.
 */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Rows shown in order, skipping the optional fields the visitor left blank. */
function rows(inquiry: Inquiry): [string, string][] {
  const entries: [string, string | undefined][] = [
    ["Name", inquiry.name],
    ["Company", inquiry.company],
    ["Email", inquiry.email],
    ["Phone", inquiry.phone],
    ["Website", inquiry.website],
    ["Services", inquiry.services.join(", ")],
    ["Budget", inquiry.budget],
    ["Timeline", inquiry.timeline],
  ];

  return entries.filter((entry): entry is [string, string] => Boolean(entry[1]));
}

export function inquirySubject(inquiry: Inquiry) {
  return `New enquiry — ${inquiry.company} (${inquiry.budget})`;
}

export function inquiryText(inquiry: Inquiry) {
  const lines = rows(inquiry).map(([label, value]) => `${label}: ${value}`);
  return `${lines.join("\n")}\n\nScope\n-----\n${inquiry.scope}\n`;
}

export function inquiryHtml(inquiry: Inquiry) {
  const cells = rows(inquiry)
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:6px 16px 6px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
          <td style="padding:6px 0;color:#111827;font-size:14px">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  // The scope is a textarea, so its line breaks carry meaning that collapsing
  // whitespace would destroy. `pre-wrap` keeps them without a <pre> font.
  return `<div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px">
    <h2 style="margin:0 0 16px;font-size:18px;color:#111827">New enquiry from the website</h2>
    <table style="border-collapse:collapse;width:100%">${cells}</table>
    <h3 style="margin:24px 0 8px;font-size:14px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em">Scope</h3>
    <p style="margin:0;color:#111827;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(inquiry.scope)}</p>
  </div>`;
}
