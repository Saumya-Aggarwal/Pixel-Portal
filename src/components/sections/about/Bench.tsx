import { Icon } from "@/components/icons";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import type { IconName } from "@/types/content";

/**
 * What the ten people cover, in place of who they are.
 *
 * This replaced a bento grid of ten individual team members. With no
 * photography the tiles fell back to seeded gradients — a wall of dark green
 * squares stamped with initials — but the colour was the lesser problem. The
 * names in it were invented placeholders, and a real agency site presenting
 * ten fictional people as its staff is a claim a visitor can check and find
 * false. Structure is the part that was true, so structure is what this
 * shows.
 *
 * Headcounts come from `content/team.ts` rather than being written in here,
 * so the panel cannot drift from the roster the rest of the site counts. The
 * responsibilities are drawn from the service catalogue in `content/services.ts`
 * — every capability named below is one the site actually sells.
 *
 * Five disciplines against three service categories is deliberate: Leadership
 * and Delivery sell nothing on their own, which is exactly why they are worth
 * naming to someone deciding whether a ten-person team can carry their work.
 */

interface Discipline {
  name: string;
  icon: IconName;
  owns: string;
}

const DISCIPLINES: Discipline[] = [
  {
    name: "Leadership",
    icon: "target",
    owns: "Commercial ownership, scoping, and the calls you are actually on.",
  },
  {
    name: "Digital Marketing",
    icon: "megaphone",
    owns: "Paid media, organic search, lifecycle, and the measurement under all three.",
  },
  {
    name: "Design",
    icon: "layers",
    owns: "Product interfaces, brand systems, and the motion that ties them together.",
  },
  {
    name: "Engineering",
    icon: "terminal",
    owns: "Platforms, bespoke applications, data pipelines, and integrations.",
  },
  {
    name: "Delivery",
    icon: "grid",
    owns: "Scope, schedule, documentation, and a handover that leaves you self-sufficient.",
  },
];

export function Bench({ headcounts }: { headcounts: Record<string, number> }) {
  return (
    <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
      {DISCIPLINES.map((discipline) => {
        const count = headcounts[discipline.name];

        return (
          <RevealItem key={discipline.name}>
            <div className="border-hair rounded-panel flex h-full flex-col border bg-white p-8">
              <div className="flex items-start justify-between gap-4">
                <span className="text-brand-600 bg-brand-50 grid h-11 w-11 shrink-0 place-items-center rounded-2xl">
                  <Icon name={discipline.icon} size={20} />
                </span>
                {count !== undefined && (
                  <span className="border-hair text-ink-soft shrink-0 rounded-full border px-2.5 py-1 text-[0.75rem] font-medium tabular-nums">
                    {count} {count === 1 ? "person" : "people"}
                  </span>
                )}
              </div>

              <h3 className="font-display text-ink mt-6 text-[1.0625rem] font-semibold">
                {discipline.name}
              </h3>
              <p className="text-muted mt-2.5 text-[0.9375rem] leading-relaxed">
                {discipline.owns}
              </p>
            </div>
          </RevealItem>
        );
      })}

      {/* Sixth cell. Five disciplines leave a gap in a three-column grid, and
          the claim that belongs in a team section — who does the work, not
          which department they sit in — is what fills it. */}
      <RevealItem>
        <div className="border-brand-200 rounded-panel bg-brand-50 flex h-full flex-col justify-center border p-8">
          <p className="font-display text-brand-900 text-[1.0625rem] leading-snug font-semibold">
            No juniors parked on the account.
          </p>
          <p className="text-brand-800 mt-3 text-[0.9375rem] leading-relaxed">
            At this size everyone is senior enough to be trusted with a client on their own.
            The people who scope your work are the people who build it.
          </p>
        </div>
      </RevealItem>
    </RevealGroup>
  );
}
