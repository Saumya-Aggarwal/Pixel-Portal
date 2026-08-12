import { BeamNetwork } from "@/components/sections/service/visuals/BeamNetwork";
import { CartToCheckout } from "@/components/sections/service/visuals/CartToCheckout";
import { FunnelFlow } from "@/components/sections/service/visuals/FunnelFlow";
import { KpiDashboard } from "@/components/sections/service/visuals/KpiDashboard";
import { LayerStack } from "@/components/sections/service/visuals/LayerStack";
import { LiveDashboard } from "@/components/sections/service/visuals/LiveDashboard";
import { OrbitField } from "@/components/sections/service/visuals/OrbitField";
import { PageAssembly } from "@/components/sections/service/visuals/PageAssembly";
import { QueueRetry } from "@/components/sections/service/visuals/QueueRetry";
import { SocialFeed } from "@/components/sections/service/visuals/SocialFeed";
import { VisualFrame } from "@/components/sections/service/visuals/VisualFrame";
import type { ServiceVisual } from "@/types/content";

/**
 * Picks the depiction for a service's hero visual.
 *
 * Same discriminated-union-plus-switch arrangement as `ServiceSections`: adding
 * a kind is a compile error here until it is handled, rather than a service
 * quietly rendering an empty frame. That is what makes retiring the remaining
 * archetypes in wave 2 a mechanical, checkable job.
 *
 * A server component composing client children — nothing here needs to be
 * reached from the server, and keeping the dispatcher server-side means an
 * unused depiction's code never enters the page's bundle.
 */
/**
 * Illustrations rebuilt to a construction blueprint.
 *
 * These bring their own ground and are drawn for a tall column beside the copy,
 * so they render unframed in a split hero. Everything else keeps the bordered
 * band beneath the copy it was drawn for. The set grows as illustrations are
 * rebuilt; `heroLayoutFor` below reads from it so the page and the frame can
 * never disagree about which arrangement a service is using.
 */
const BLUEPRINTED = new Set<ServiceVisual["kind"]>(["live-dashboard"]);

/** Which hero arrangement a service's illustration needs. */
export function heroLayoutFor(visual?: ServiceVisual): "stacked" | "split" {
  return visual && BLUEPRINTED.has(visual.kind) ? "split" : "stacked";
}

export function ServiceHeroVisual({ visual, title }: { visual: ServiceVisual; title: string }) {
  const bare = BLUEPRINTED.has(visual.kind);

  return (
    <VisualFrame
      label={`Diagram illustrating ${title}`}
      bare={bare}
      className={bare ? "mt-10 lg:mt-0" : "mt-14 h-76 lg:mt-20 lg:h-84"}
    >
      {render(visual)}
    </VisualFrame>
  );
}

function render(visual: ServiceVisual) {
  switch (visual.kind) {
    // Bespoke depictions.
    case "social-feed":
      return <SocialFeed />;
    case "page-assembly":
      return <PageAssembly />;
    case "live-dashboard":
      return <LiveDashboard />;
    case "cart-checkout":
      return <CartToCheckout />;
    case "queue-retry":
      return <QueueRetry />;
    // Archetypes — retiring.
    case "beams":
      return <BeamNetwork left={visual.left} right={visual.right} />;
    case "funnel":
      return <FunnelFlow stages={visual.stages} callouts={visual.callouts} />;
    case "dashboard":
      return <KpiDashboard panels={visual.panels} kpis={visual.kpis} />;
    case "orbit":
      return <OrbitField nodes={visual.nodes} />;
    case "stack":
      return <LayerStack layers={visual.layers} />;
  }
}
