import { CtaSection } from "@/components/sections/CtaSection";
import { TrustPanel } from "@/components/sections/TrustPanel";
import { ClientStrip } from "@/components/sections/home/ClientStrip";
import { FeaturedWork } from "@/components/sections/home/FeaturedWork";
import { Hero } from "@/components/sections/home/Hero";
import { Process } from "@/components/sections/home/Process";
import { ServicePillars } from "@/components/sections/home/ServicePillars";
import { getTeam } from "@/lib/content";

export default async function HomePage() {
  // The hero is a Client Component (Spline, pointer tilt, load-in timeline),
  // so its content is fetched here and passed down — keeping `@/lib/content`
  // the server-only seam it is meant to be.
  const team = await getTeam();

  return (
    <>
      <Hero specialists={team.slice(0, 4)} />
      <ClientStrip />
      {/* The seam below the ticker is `ServicePillars`' own top divider. */}
      <ServicePillars />
      <FeaturedWork />
      {/* Supersedes the bare `Stats` rail: same four figures, plus the
          verifiable facts. `clients` stays off — ClientStrip runs the same
          eight names above the fold. */}
      <TrustPanel />
      <Process />
      <CtaSection />
    </>
  );
}
