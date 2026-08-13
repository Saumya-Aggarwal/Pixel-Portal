import { AdsFunnel } from "@/components/sections/service/visuals/AdsFunnel";
import { AppShell } from "@/components/sections/service/visuals/AppShell";
import { BreakpointRuler } from "@/components/sections/service/visuals/BreakpointRuler";
import { CartToCheckout } from "@/components/sections/service/visuals/CartToCheckout";
import { CrawlGraph } from "@/components/sections/service/visuals/CrawlGraph";
import { EmailFlow } from "@/components/sections/service/visuals/EmailFlow";
import { HeadlessSeam } from "@/components/sections/service/visuals/HeadlessSeam";
import { LayeredPlanes } from "@/components/sections/service/visuals/LayeredPlanes";
import { LiveDashboard } from "@/components/sections/service/visuals/LiveDashboard";
import { MarketplaceBridge } from "@/components/sections/service/visuals/MarketplaceBridge";
import { PipelineStair } from "@/components/sections/service/visuals/PipelineStair";
import { QueueRetry } from "@/components/sections/service/visuals/QueueRetry";
import { SocialFeed } from "@/components/sections/service/visuals/SocialFeed";
import { TableTransfer } from "@/components/sections/service/visuals/TableTransfer";
import { VisualFrame } from "@/components/sections/service/visuals/VisualFrame";
import type { ServiceVisual } from "@/types/content";

/**
 * Picks the depiction for a service's hero visual.
 *
 * Same discriminated-union-plus-switch arrangement as `ServiceSections`: adding
 * a kind is a compile error here until it is handled, rather than a service
 * quietly rendering an empty frame.
 *
 * A server component composing client children — nothing here needs to be
 * reached from the server, and keeping the dispatcher server-side means an
 * unused depiction's code never enters the page's bundle.
 */
export function ServiceHeroVisual({
  visual,
  title,
}: {
  visual: ServiceVisual;
  title: string;
}) {
  return (
    <VisualFrame
      label={`Diagram illustrating ${title}`}
      className="mt-10 lg:mt-0"
    >
      {render(visual)}
    </VisualFrame>
  );
}

/**
 * Which hero arrangement a service's illustration needs.
 *
 * Every illustration is now drawn to the 960x640 blueprint canvas and brings its
 * own ground, so all fourteen take the split hero. Kept as a function rather
 * than inlined at the call site because it is the seam the page and the frame
 * agree on — if a future depiction needs the stacked band back, it changes here
 * and nowhere else.
 */
export function heroLayoutFor(visual?: ServiceVisual): "stacked" | "split" {
  return visual ? "split" : "stacked";
}

function render(visual: ServiceVisual) {
  switch (visual.kind) {
    case "social-feed":
      return <SocialFeed />;
    case "live-dashboard":
      return <LiveDashboard />;
    case "cart-checkout":
      return <CartToCheckout />;
    case "queue-retry":
      return <QueueRetry />;
    case "ads-funnel":
      return <AdsFunnel />;
    case "crawl-graph":
      return <CrawlGraph />;
    case "email-flow":
      return <EmailFlow />;
    case "layered-planes":
      return <LayeredPlanes />;
    case "marketplace-bridge":
      return <MarketplaceBridge />;
    case "headless-seam":
      return <HeadlessSeam />;
    case "breakpoint-ruler":
      return <BreakpointRuler />;
    case "app-shell":
      return <AppShell />;
    case "pipeline-stair":
      return <PipelineStair />;
    case "table-transfer":
      return <TableTransfer />;
  }
}
