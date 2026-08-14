import { ArcDial } from "@/components/sections/category/ArcDial";
import { JourneyLedger } from "@/components/sections/category/JourneyLedger";
import { Workbench } from "@/components/sections/category/Workbench";

/**
 * Picks the hero illustration for a category page.
 *
 * Returns `null` for a category whose piece is not built yet, and `PageHero`
 * renders nothing for absent children — so a category without one keeps exactly
 * the hero it has today rather than reserving an empty band. That is what lets
 * these land one at a time.
 *
 * Deliberately keyed on the slug rather than on a field in `services.ts`. There
 * are exactly three of these and each is a bespoke component with no
 * configuration, so a content field would be a lookup table with three rows
 * pointing at three imports — the switch *is* the table, and it lives next to
 * the thing it dispatches to.
 *
 * Unlike the service illustrations, these are not wrapped in `VisualFrame`.
 * `role="img"` would bury the five service links inside them: an element with an
 * image role exposes no children to assistive technology, so the links would be
 * unreachable. The decorative layers carry `aria-hidden` individually instead,
 * and the links are left in the accessibility tree where they belong.
 */
export function CategoryHeroVisual({ slug }: { slug: string }) {
  switch (slug) {
    case "digital-marketing":
      return (
        <div className="mt-14 lg:mt-20">
          <JourneyLedger />
        </div>
      );
    case "website-development":
      return (
        <div className="mt-14 lg:mt-20">
          <ArcDial />
        </div>
      );
    case "software-development":
      return (
        <div className="mt-14 lg:mt-20">
          <Workbench />
        </div>
      );
    default:
      return null;
  }
}
