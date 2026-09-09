"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { BrowserChrome } from "@/components/sections/service/visuals/chrome/BrowserChrome";
import { CalloutChip } from "@/components/sections/service/visuals/chrome/Callout";
import { FloatPanel } from "@/components/sections/service/visuals/chrome/FloatPanel";
import { GridGround } from "@/components/sections/service/visuals/chrome/GridGround";
import { cq, px, py, ts } from "@/components/sections/service/visuals/canvas";
import { CartToCheckoutPhone } from "@/components/sections/service/visuals/CartToCheckoutPhone";
import {
  BEATS,
  CART_TOTAL,
  CHECKOUT_FIELDS,
  CHECKOUT_TITLE,
  CHOSEN,
  CartGlyph,
  EMPTY_CART,
  GATEWAY,
  INVENTORY_LABEL,
  IN_CART,
  ORDER_ID,
  PAID_TITLE,
  PRODUCTS,
  SESSIONS,
  SESSIONS_LABEL,
  SHEET_UP,
  STOCK_HELD,
  STOCK_SOLD,
  STOREFRONT,
  TOTAL_LABEL,
  URL,
  type Beat,
} from "@/components/sections/service/visuals/cartCheckoutShared";
import { useVisualPlayback } from "@/components/sections/service/visuals/useVisualPlayback";
import { EASE } from "@/lib/motion";

/**
 * A storefront being shopped.
 *
 * Back to the real thing: a browser, a product grid, an item going into the
 * cart, a checkout sheet, a confirmation. An earlier pass abstracted this into
 * a stack of funnel stages, which explained the same sequence and showed none
 * of it — the version people recognise is the one where you watch someone buy
 * something.
 *
 * **Topology.** The browser is deliberately large and left-of-centre, with the
 * two operational figures on the diagonal — sessions above-right, inventory
 * below-right. That keeps it clear of the feeder silhouette (two panels stacked
 * left, one focal right) already used by the analytics and social pages.
 *
 * A state machine rather than a loop: beats are discrete, hold for different
 * lengths, and change what is on screen.
 *
 * The phone stage keeps the browser and turns the checkout into a bottom sheet;
 * see `CartToCheckoutPhone` for why.
 */

export function CartToCheckout() {
  return (
    <>
      <div className="md:hidden">
        <CartToCheckoutPhone />
      </div>
      <div className="hidden md:block">
        <CartToCheckoutDesktop />
      </div>
    </>
  );
}

function CartToCheckoutDesktop() {
  const { ref, playing } = useVisualPlayback<HTMLDivElement>();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(
      () => setStep((s) => (s + 1) % BEATS.length),
      BEATS[step].hold * 1000,
    );
    return () => window.clearTimeout(id);
  }, [playing, step]);

  // Paused readers land on "paid" — the order confirmed and the stock already
  // decremented, which carries the whole sequence in one frame.
  const beat: Beat = playing ? BEATS[step].id : "paid";
  const sold = beat === "paid";

  return (
    <div ref={ref} className="@container relative aspect-3/2 w-full">
      <GridGround />
      <Backlight size="lg" className="left-[25%] top-[25%]" />

      {/* The storefront. */}
      <motion.div
        className="absolute"
        style={{
          left: px(40),
          top: py(90),
          width: px(560),
          height: py(460),
          zIndex: 20,
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: EASE.out }}
      >
        <BrowserChrome url={URL} className="h-full">
          <div className="relative h-full">
            <div
              className="border-hair flex items-center justify-between border-b"
              style={{ padding: `${ts(14)} ${ts(18)}` }}
            >
              <span
                className="text-ink font-medium"
                style={{ fontSize: ts(13) }}
              >
                {STOREFRONT}
              </span>
              <span className="flex items-center" style={{ gap: ts(8) }}>
                <CartGlyph />
                <span
                  className={
                    IN_CART.has(beat)
                      ? "text-brand-700 font-medium"
                      : "text-muted"
                  }
                  style={{ fontSize: ts(12) }}
                >
                  {IN_CART.has(beat) ? CART_TOTAL : EMPTY_CART}
                </span>
              </span>
            </div>

            <div style={{ padding: ts(18) }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: cq(14),
                }}
              >
                {PRODUCTS.map((product, i) => {
                  const chosen = i === CHOSEN;
                  return (
                    <div
                      key={product.name}
                      className="border-hair overflow-hidden rounded-lg border bg-white"
                      style={{
                        borderColor:
                          chosen && IN_CART.has(beat)
                            ? "var(--color-brand-300)"
                            : undefined,
                      }}
                    >
                      <motion.div
                        className={chosen ? "bg-brand-100" : "bg-brand-50"}
                        style={{ height: cq(92) }}
                        animate={
                          chosen && beat === "added"
                            ? { scale: [1, 0.94, 1] }
                            : { scale: 1 }
                        }
                        transition={{ duration: 0.45, ease: EASE.out }}
                      />
                      <div
                        style={{ padding: cq(11), display: "grid", gap: cq(6) }}
                      >
                        <span
                          className="text-ink truncate"
                          style={{ fontSize: ts(11) }}
                        >
                          {product.name}
                        </span>
                        <span
                          className="text-ink-soft tabular-nums"
                          style={{ fontSize: ts(11) }}
                        >
                          {product.price}
                        </span>
                        <span
                          className={
                            chosen && IN_CART.has(beat)
                              ? "bg-brand-600 block rounded-full"
                              : "bg-hair block rounded-full"
                          }
                          style={{ height: cq(16), marginTop: cq(3) }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Checkout sheet, sliding in from the right over the grid. */}
            <AnimatePresence>
              {SHEET_UP.has(beat) && (
                <motion.div
                  key="sheet"
                  className="border-hair absolute inset-y-0 right-0 border-l bg-white"
                  style={{
                    width: "46%",
                    padding: ts(18),
                    boxShadow: "var(--shadow-float)",
                  }}
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.5, ease: EASE.out }}
                >
                  <p
                    className={
                      sold
                        ? "font-display text-brand-600 leading-none font-semibold"
                        : "font-display text-ink leading-none font-semibold"
                    }
                    style={{ fontSize: ts(15) }}
                  >
                    {sold ? PAID_TITLE : CHECKOUT_TITLE}
                  </p>

                  <div
                    style={{ display: "grid", gap: cq(10), marginTop: ts(16) }}
                  >
                    {CHECKOUT_FIELDS.map(([label, value]) => (
                      <div
                        key={label}
                        className="border-hair rounded-md border"
                        style={{ padding: cq(9) }}
                      >
                        <span
                          className="text-muted block"
                          style={{ fontSize: ts(10) }}
                        >
                          {label}
                        </span>
                        <span
                          className="text-ink-soft block truncate"
                          style={{ fontSize: ts(11), marginTop: cq(4) }}
                        >
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    className="border-hair flex items-center justify-between border-t"
                    style={{ marginTop: ts(14), paddingTop: ts(12) }}
                  >
                    <span
                      className="text-ink-soft"
                      style={{ fontSize: ts(11) }}
                    >
                      {TOTAL_LABEL}
                    </span>
                    <span
                      className="text-ink font-semibold tabular-nums"
                      style={{ fontSize: ts(13) }}
                    >
                      {CART_TOTAL}
                    </span>
                  </div>

                  <div
                    className={sold ? "bg-brand-600" : "bg-brand-200"}
                    style={{
                      height: ts(26),
                      marginTop: ts(12),
                      borderRadius: 999,
                    }}
                  />
                  {sold && (
                    <p
                      className="text-muted tabular-nums"
                      style={{ fontSize: ts(10), marginTop: ts(10) }}
                    >
                      {ORDER_ID}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </BrowserChrome>
      </motion.div>

      {/* Operational figures, on the diagonal rather than stacked. */}
      <FloatPanel
        playing={playing}
        float={{ amplitude: 3, period: 14, phase: 0.2 }}
        className="absolute flex flex-col justify-center"
        style={{
          left: px(660),
          top: py(120),
          width: px(220),
          height: py(120),
          padding: `0 ${ts(22)}`,
          borderRadius: "clamp(0.625rem, 2.083cqw, 1.25rem)",
          zIndex: 30,
        }}
      >
        <span className="text-ink-soft" style={{ fontSize: ts(12) }}>
          {SESSIONS_LABEL}
        </span>
        <span
          className="font-display text-ink leading-none font-semibold tracking-tight tabular-nums"
          style={{ fontSize: ts(24), marginTop: ts(10) }}
        >
          {SESSIONS}
        </span>
      </FloatPanel>

      <div
        className="absolute"
        style={{ left: px(640), top: py(276), zIndex: 30 }}
      >
        <CalloutChip style={{ fontSize: ts(11) }}>{GATEWAY}</CalloutChip>
      </div>

      <FloatPanel
        playing={playing}
        float={{ amplitude: 3, period: 16, phase: 0.55 }}
        className="absolute flex flex-col justify-center"
        style={{
          left: px(660),
          top: py(370),
          width: px(220),
          height: py(120),
          padding: `0 ${ts(22)}`,
          borderRadius: "clamp(0.625rem, 2.083cqw, 1.25rem)",
          zIndex: 30,
        }}
      >
        <span className="text-ink-soft" style={{ fontSize: ts(12) }}>
          {INVENTORY_LABEL}
        </span>
        <motion.span
          className="font-display text-brand-600 leading-none font-semibold tracking-tight tabular-nums"
          style={{ fontSize: ts(24), marginTop: ts(10) }}
          key={sold ? "sold" : "held"}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE.out }}
        >
          {sold ? STOCK_SOLD : STOCK_HELD}
        </motion.span>
      </FloatPanel>
    </div>
  );
}
