import type { BentoSize, TeamMember } from "@/types/content";

/**
 * The 50-person team (SOW §2). Placeholder names and roles — the department
 * mix and the bento size distribution are the parts that matter for layout.
 *
 * Authored as tuples to keep 50 people readable in one screen; the exported
 * shape is the full TeamMember object that Sanity will eventually return.
 */
type Row = [name: string, role: string, department: string, size: BentoSize];

const rows: Row[] = [
  // Leadership — the anchor tiles in the bento grid
  ["Ananya Rao", "Founder & Chief Executive", "Leadership", "feature"],
  ["Marcus Dell", "Chief Technology Officer", "Leadership", "tall"],
  ["Priya Venkat", "Executive Creative Director", "Leadership", "wide"],
  ["Tobias Lund", "Head of Growth", "Leadership", "standard"],
  ["Sana Qureshi", "Head of Operations", "Leadership", "standard"],

  // Digital Marketing
  ["Devon Hale", "Group Strategy Director", "Digital Marketing", "wide"],
  ["Ines Moreau", "Paid Media Lead", "Digital Marketing", "standard"],
  ["Rahul Menon", "SEO Director", "Digital Marketing", "tall"],
  ["Claire Osei", "Social Strategy Lead", "Digital Marketing", "standard"],
  ["Yusuf Demir", "Performance Analyst", "Digital Marketing", "standard"],
  ["Nadia Farrell", "Content Director", "Digital Marketing", "standard"],
  ["Owen Brandt", "Media Buyer", "Digital Marketing", "standard"],
  ["Meera Iyer", "Lifecycle Marketing Lead", "Digital Marketing", "standard"],
  ["Jonas Reid", "Analytics Engineer", "Digital Marketing", "standard"],
  ["Amara Nwosu", "Community Manager", "Digital Marketing", "standard"],
  ["Felix Toma", "Copywriter", "Digital Marketing", "standard"],
  ["Ritu Bansal", "Campaign Manager", "Digital Marketing", "standard"],

  // Design
  ["Lucia Ferrer", "Design Director", "Design", "feature"],
  ["Kai Nakamura", "Motion Design Lead", "Design", "tall"],
  ["Sofia Almeida", "Senior Product Designer", "Design", "standard"],
  ["Elias Wren", "Brand Designer", "Design", "wide"],
  ["Hana Kobayashi", "UX Researcher", "Design", "standard"],
  ["Theo Marchand", "Interaction Designer", "Design", "standard"],
  ["Bilal Haq", "Visual Designer", "Design", "standard"],
  ["Greta Lindqvist", "Design Systems Lead", "Design", "standard"],

  // Engineering
  ["Samuel Adeyemi", "Principal Engineer", "Engineering", "tall"],
  ["Wei Zhang", "Frontend Lead", "Engineering", "wide"],
  ["Isabel Cruz", "Backend Lead", "Engineering", "standard"],
  ["Nikhil Sharma", "Platform Engineer", "Engineering", "standard"],
  ["Anders Holm", "Senior Frontend Engineer", "Engineering", "standard"],
  ["Fatima Zahra", "Senior Backend Engineer", "Engineering", "standard"],
  ["Diego Salas", "Full-Stack Engineer", "Engineering", "standard"],
  ["Ruth Kimani", "Full-Stack Engineer", "Engineering", "standard"],
  ["Petra Novak", "E-Commerce Engineer", "Engineering", "standard"],
  ["Arjun Pillai", "Integrations Engineer", "Engineering", "standard"],
  ["Cody Mercer", "Data Engineer", "Engineering", "standard"],
  ["Lena Fischer", "DevOps Engineer", "Engineering", "standard"],
  ["Tomas Ruiz", "Mobile Engineer", "Engineering", "standard"],
  ["Aisha Bello", "QA Lead", "Engineering", "standard"],
  ["Viktor Petrov", "QA Engineer", "Engineering", "standard"],
  ["Emeka Chukwu", "Security Engineer", "Engineering", "standard"],

  // Delivery
  ["Harriet Vance", "Delivery Director", "Delivery", "wide"],
  ["Santiago Rojas", "Senior Project Manager", "Delivery", "standard"],
  ["Mei Lin", "Project Manager", "Delivery", "standard"],
  ["Oskar Bergman", "Project Manager", "Delivery", "standard"],
  ["Zoya Karim", "Account Director", "Delivery", "standard"],
  ["Callum Doyle", "Account Manager", "Delivery", "standard"],
  ["Divya Nair", "Business Analyst", "Delivery", "standard"],
  ["Martin Sole", "Resource Manager", "Delivery", "standard"],
  ["Naomi Sato", "People & Talent Lead", "Delivery", "standard"],
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
