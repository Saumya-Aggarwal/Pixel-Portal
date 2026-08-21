import type { BentoSize, TeamMember } from "@/types/content";

/**
 * The 10-person team (site.ts `teamSize`). Placeholder names and roles — the
 * department mix and the bento size distribution are the parts that matter
 * for layout. Two per department keeps every filter tab non-empty at this
 * size; trimmed down from an earlier 50-person draft, not grown up from one.
 *
 * Authored as tuples to keep the roster readable in one screen; the exported
 * shape is the full TeamMember object that Sanity will eventually return.
 */
type Row = [name: string, role: string, department: string, size: BentoSize];

const rows: Row[] = [
  // Leadership — the anchor tiles in the bento grid
  ["Ananya Rao", "Founder & Chief Executive", "Leadership", "feature"],
  ["Marcus Dell", "Chief Technology Officer", "Leadership", "tall"],

  // Digital Marketing
  ["Devon Hale", "Group Strategy Director", "Digital Marketing", "wide"],
  ["Rahul Menon", "SEO Director", "Digital Marketing", "standard"],

  // Design
  ["Lucia Ferrer", "Design Director", "Design", "wide"],
  ["Kai Nakamura", "Motion Design Lead", "Design", "standard"],

  // Engineering
  ["Samuel Adeyemi", "Principal Engineer", "Engineering", "standard"],
  ["Wei Zhang", "Frontend Lead", "Engineering", "standard"],

  // Delivery
  ["Harriet Vance", "Delivery Director", "Delivery", "standard"],
  ["Zoya Karim", "Account Director", "Delivery", "standard"],
];

export const team: TeamMember[] = rows.map(([name, role, department, size]) => ({
  id: name.toLowerCase().replace(/[^a-z]+/g, "-"),
  name,
  role,
  department,
  size,
}));

/** Department order used by the About page filter rail. */
export const departments = [
  "Leadership",
  "Digital Marketing",
  "Design",
  "Engineering",
  "Delivery",
] as const;
