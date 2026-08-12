"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Icon } from "@/components/icons";
import { Logo } from "@/components/layout/Logo";
import { Magnetic } from "@/components/motion/Magnetic";
import { ArrowGlyph, Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { cn } from "@/lib/cn";
import { DUR, EASE } from "@/lib/motion";
import type { Category, NavItem } from "@/types/content";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface HeaderClientProps {
  nav: NavItem[];
  categories: Category[];
}

export function HeaderClient({ nav, categories }: HeaderClientProps) {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Solid glass only once the page has moved. At the very top the header sits
  // directly on the hero's white field, and a panel edge there is just noise.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Route changes must close everything, or the menu survives the navigation
  // it just triggered. Adjusted during render rather than in an effect: React
  // restarts the render immediately with the corrected state, so the menu is
  // never painted open on the new route the way an effect would allow.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpenCategory(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenCategory(null);
      setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock the page behind the full-screen mobile menu.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  /**
   * A short close delay keeps the panel alive while the pointer crosses the
   * gap between the trigger and the panel below it. Without it the menu
   * flickers shut mid-travel and becomes impossible to use.
   */
  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenCategory(null), 140);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => () => cancelClose(), [cancelClose]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const activeCategory = categories.find((c) => c.slug === openCategory);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500 ease-soft",
        scrolled || openCategory
          ? "border-hair/80 border-b bg-white/75 shadow-[0_1px_24px_-12px_rgb(13_58_32/0.25)] backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent",
      )}
      onMouseLeave={scheduleClose}
    >
      <Container wide>
        <div className="flex h-18 items-center justify-between gap-6 lg:h-20">
          <Link href="/" aria-label="Pixel Portal — home" className="shrink-0">
            <Logo />
          </Link>

          {/* ---- Desktop navigation ---- */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const hasMenu = Boolean(item.categorySlug);
                const expanded = openCategory === item.categorySlug;

                return (
                  <li
                    key={item.href}
                    onMouseEnter={
                      hasMenu
                        ? () => {
                            cancelClose();
                            setOpenCategory(item.categorySlug!);
                          }
                        : () => scheduleClose()
                    }
                  >
                    <Link
                      href={item.href}
                      // The link navigates; the aria-expanded state describes
                      // the panel it also reveals. Screen-reader users can go
                      // straight to the category page and skip the menu.
                      aria-expanded={hasMenu ? expanded : undefined}
                      aria-haspopup={hasMenu ? "true" : undefined}
                      onFocus={
                        hasMenu ? () => setOpenCategory(item.categorySlug!) : () => setOpenCategory(null)
                      }
                      className={cn(
                        "relative inline-flex h-10 items-center rounded-full px-4 text-[0.9375rem] transition-colors duration-300",
                        isActive(item.href)
                          ? "text-brand-800"
                          : "text-ink-soft hover:text-brand-700",
                      )}
                    >
                      {item.label}
                      {isActive(item.href) && (
                        <motion.span
                          layoutId={prefersReduced ? undefined : "nav-pill"}
                          className="bg-brand-50 absolute inset-0 -z-10 rounded-full"
                          transition={{ duration: DUR.fast, ease: EASE.soft }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden shrink-0 lg:block">
            <Magnetic strength={0.3} padding={8}>
              <Button href="/contact" size="sm" className="group">
                Start a project
                <ArrowGlyph />
              </Button>
            </Magnetic>
          </div>

          {/* ---- Mobile trigger ---- */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="text-ink -mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-full lg:hidden"
          >
            <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
            <span className="relative block h-4 w-6" aria-hidden>
              <span
                className={cn(
                  "bg-ink absolute left-0 block h-[1.5px] w-6 transition-all duration-300 ease-out-expo",
                  mobileOpen ? "top-1.75 rotate-45" : "top-0.75",
                )}
              />
              <span
                className={cn(
                  "bg-ink absolute left-0 block h-[1.5px] w-6 transition-all duration-300 ease-out-expo",
                  mobileOpen ? "top-1.75 -rotate-45" : "top-2.75",
                )}
              />
            </span>
          </button>
        </div>
      </Container>

      {/* ---- Mega-menu ---- */}
      <AnimatePresence>
        {activeCategory && (
          <motion.div
            key={activeCategory.slug}
            initial={prefersReduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: DUR.fast, ease: EASE.out }}
            onMouseEnter={cancelClose}
            className="border-hair/70 hidden border-t bg-white/85 backdrop-blur-xl lg:block"
          >
            <Container wide>
              <div className="grid grid-cols-12 gap-8 py-10">
                <div className="col-span-3">
                  <p className="text-eyebrow text-brand-700 uppercase">
                    {activeCategory.eyebrow}
                  </p>
                  <h2 className="font-display text-ink mt-3 text-[1.5rem] leading-tight font-semibold tracking-tight">
                    {activeCategory.headline}
                  </h2>
                  <p className="text-muted mt-3 text-[0.9375rem] leading-relaxed">
                    {activeCategory.description}
                  </p>
                  <Link
                    href={`/${activeCategory.slug}`}
                    className="text-brand-700 group mt-5 inline-flex items-center gap-2 text-[0.9375rem] font-medium"
                  >
                    View overview
                    <ArrowGlyph />
                  </Link>
                </div>

                <ul className="col-span-9 grid grid-cols-3 gap-2">
                  {activeCategory.services.map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={`/${activeCategory.slug}/${service.slug}`}
                        className="group hover:border-brand-200 hover:bg-brand-50/60 flex h-full gap-3.5 rounded-2xl border border-transparent p-4 transition-colors duration-300"
                      >
                        <span className="text-brand-600 bg-brand-50 group-hover:bg-white grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors duration-300">
                          <Icon name={service.icon} size={20} />
                        </span>
                        <span className="min-w-0">
                          <span className="text-ink group-hover:text-brand-800 block text-[0.9375rem] font-medium transition-colors">
                            {service.navTitle ?? service.title}
                          </span>
                          <span className="text-muted mt-1 block text-[0.8125rem] leading-snug">
                            {service.tagline}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Mobile menu ---- */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.fast, ease: EASE.soft }}
            className="fixed inset-x-0 top-18 bottom-0 overflow-y-auto bg-white lg:hidden"
          >
            <Container className="pt-6 pb-16">
              <ul className="divide-hair divide-y">
                {nav.map((item, index) => {
                  const category = categories.find((c) => c.slug === item.categorySlug);

                  return (
                    <motion.li
                      key={item.href}
                      initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: DUR.base,
                        ease: EASE.out,
                        delay: prefersReduced ? 0 : 0.04 * index,
                      }}
                      className="py-5"
                    >
                      <Link
                        href={item.href}
                        className="font-display text-ink flex items-center justify-between text-[1.5rem] font-semibold tracking-tight"
                      >
                        {item.label}
                        <ArrowGlyph />
                      </Link>

                      {category && (
                        <ul className="mt-3 space-y-0.5">
                          {category.services.map((service) => (
                            <li key={service.slug}>
                              <Link
                                href={`/${category.slug}/${service.slug}`}
                                className="text-muted hover:text-brand-700 flex min-h-11 items-center gap-2.5 text-[0.9375rem]"
                              >
                                <span className="bg-brand-300 h-px w-4 shrink-0" aria-hidden />
                                {service.navTitle ?? service.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.li>
                  );
                })}
              </ul>

              <Button href="/contact" size="lg" className="group mt-8 w-full">
                Start a project
                <ArrowGlyph />
              </Button>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
