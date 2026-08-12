import { HeaderClient } from "@/components/layout/HeaderClient";
import { getCategories, getNavigation } from "@/lib/content";

/**
 * Server shell for the header. Data is read here and handed to the client
 * component, so the nav tree stays out of the client bundle and the mega-menu
 * cannot drift from the service content that generates the routes.
 */
export async function Header() {
  const [nav, categories] = await Promise.all([getNavigation(), getCategories()]);
  return <HeaderClient nav={nav} categories={categories} />;
}
