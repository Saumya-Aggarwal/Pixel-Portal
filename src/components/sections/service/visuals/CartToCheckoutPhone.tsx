"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { Backlight } from "@/components/sections/service/visuals/chrome/Backlight";
import { BrowserChrome } from "@/components/sections/service/visuals/chrome/BrowserChrome";
import { FloatPanel } from "@/components/sections/service/visuals/chrome/FloatPanel";
import { GridGround } from "@/components/sections/service/visuals/chrome/GridGround";
import { createCanvas } from "@/components/sections/service/visuals/canvas";
import {
  BEATS,
  CART_TOTAL,
  CHECKOUT_FIELDS,
  CHECKOUT_TITLE,
  CHOSEN,
  CartGlyph,
  EMPTY_CART,
  GATEWAY,
  IN_CART,
  INVENTORY_LABEL,
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
 * Phone stage of the ecommerce-platforms depiction.
 *
 * The 960x640 drawing is a wide browser with a three-up product grid and a
 * checkout that slides in from the right, flanked by two operational figures on
 * the diagonal. At 327px the product cards lost their add-to-cart buttons off
 * the bottom, and both figures wrapped their two-word labels out of their own
 * panels.
 *
 * **The browser stays, because this is the one drawing whose subject a phone
 * already is.** Most of the pieces in this set had to give up their frame at
 * this width; a storefront does not, since a 320-unit browser showing a mobile
 * shop is not a compromise on the subject — it is where most of the buying
 * happens. `BrowserChrome` is shared across four of these drawings on purpose,
 * so keeping it here is the system working rather than a repeat.
 *
 * **Two things change, and both are platform idiom rather than scaling.** The
 * catalogue becomes a shelf: two cards and the edge of a third, cut by the
 * window, which is what a mobile storefront looks like and keeps all three
 * products in a drawing that could only fit two. And the checkout stops sliding
 * in from the right and rises from the bottom, because on a phone a checkout is
 * a bottom sheet. Sliding a 46%-wide panel in from the side of a 320-unit
 * window would leave 170 units for a payment form and still not be what anyone
 * has ever seen a phone do.
 *
 * The gateway chip moves onto the sheet's card row. On the wide canvas it
 * floats between the two figures as an annotation; here it is doing the same
 * job in the only place it can go, which happens to be the place payment
 * actually occurs.
 */

const { W, H, px, py, ts, cq } = createCanvas(360, 500);

/**
 * The window, sized around two things that both grow as the canvas shrinks.
 *
 * `BrowserChrome`'s bar is set in fixed pixels, so in canvas units it is 40 at a
 * 430 viewport and 56 at a 320 one; and the sheet's type is floored at 10px, so
 * it stands 270 units tall at 320 against 248 at 430. The body is sized so the
 * tallest sheet still leaves the storefront's header — and with it the cart
 * total, which is the only thing tying the two states together — above it.
 */
const BROWSER = { x: 20, y: 20, w: 320, h: 362 };
const STATS = { y: 406, w: 152, h: 74 };

/**
 * A shelf: two cards, and enough of a third that the window is clearly cutting
 * it. The chosen product is the second, so it has to clear the frame whole —
 * 124 and 10 put its right edge 34 units inside, with 32 of the third showing.
 */
const CARD_W = 124;
const CARD_GAP = 10;
const SHELF_PAD = 10;

export function CartToCheckoutPhone() {
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
  const inCart = IN_CART.has(beat);

  return (
    <div
      ref={ref}
      className="@container relative w-full"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <GridGround />
      <Backlight size="lg" className="top-[12%] left-[18%]" />

      <motion.div
        className="absolute"
        style={{
          left: px(BROWSER.x),
          top: py(BROWSER.y),
          width: px(BROWSER.w),
          height: py(BROWSER.h),
          zIndex: 20,
        }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: EASE.out }}
      >
        <BrowserChrome url={URL} className="h-full">
          <div className="relative h-full overflow-hidden">
            <div
              className="border-hair flex items-center justify-between border-b"
              style={{ padding: `${cq(11)} ${cq(14)}` }}
            >
              <span
                className="text-ink font-medium"
                style={{ fontSize: ts(12) }}
              >
                {STOREFRONT}
              </span>
              <span className="flex items-center" style={{ gap: cq(7) }}>
                <CartGlyph size={cq(14)} />
                <span
                  className={
                    inCart ? "text-brand-700 font-medium" : "text-muted"
                  }
                  style={{ fontSize: ts(11) }}
                >
                  {inCart ? CART_TOTAL : EMPTY_CART}
                </span>
              </span>
            </div>

            {/* The shelf. `overflow-hidden` on the window does the cutting, so
                the third card is trimmed by the frame rather than by a rule
                that would have to be kept in step with the frame's width. */}
            <div
              className="flex"
              style={{ padding: cq(SHELF_PAD), gap: cq(CARD_GAP) }}
            >
              {PRODUCTS.map((product, i) => {
                const chosen = i === CHOSEN;
                return (
                  <div
                    key={product.name}
                    className="border-hair shrink-0 overflow-hidden rounded-lg border bg-white"
                    style={{
                      width: cq(CARD_W),
                      borderColor:
                        chosen && inCart ? "var(--color-brand-300)" : undefined,
                    }}
                  >
                    <motion.div
                      className={chosen ? "bg-brand-100" : "bg-brand-50"}
                      style={{ height: cq(CARD_W) }}
                      animate={
                        chosen && beat === "added"
                          ? { scale: [1, 0.94, 1] }
                          : { scale: 1 }
                      }
                      transition={{ duration: 0.45, ease: EASE.out }}
                    />
                    <div
                      style={{ padding: cq(10), display: "grid", gap: cq(5) }}
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
                          chosen && inCart
                            ? "bg-brand-600 block rounded-full"
                            : "bg-hair block rounded-full"
                        }
                        style={{ height: cq(14), marginTop: cq(2) }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checkout, rising from the bottom the way a phone's does. */}
            <AnimatePresence>
              {SHEET_UP.has(beat) && (
                <motion.div
                  key="sheet"
                  className="border-hair absolute inset-x-0 bottom-0 border-t bg-white"
                  style={{
                    padding: cq(14),
                    borderTopLeftRadius: cq(14),
                    borderTopRightRadius: cq(14),
                    boxShadow: "var(--shadow-float)",
                  }}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ duration: 0.5, ease: EASE.out }}
                >
                  {/* The grab handle. One element, and it is what tells a
                      reader this is a sheet rather than a panel. */}
                  <span
                    aria-hidden
                    className="bg-hair mx-auto block rounded-full"
                    style={{ width: cq(36), height: cq(4) }}
                  />

                  <span
                    className={
                      sold
                        ? "font-display text-brand-600 block leading-none font-semibold"
                        : "font-display text-ink block leading-none font-semibold"
                    }
                    style={{ fontSize: ts(14), marginTop: cq(12) }}
                  >
                    {sold ? PAID_TITLE : CHECKOUT_TITLE}
                  </span>

                  <span
                    style={{ display: "grid", gap: cq(8), marginTop: cq(12) }}
                  >
                    {CHECKOUT_FIELDS.map(([label, value], i) => (
                      <span
                        key={label}
                        className="flex items-baseline justify-between"
                        style={{ gap: cq(10) }}
                      >
                        <span
                          className="text-muted shrink-0"
                          style={{ fontSize: ts(10) }}
                        >
                          {label}
                        </span>
                        <span
                          className="flex min-w-0 items-baseline"
                          style={{ gap: cq(6) }}
                        >
                          <span
                            className="text-ink-soft truncate"
                            style={{ fontSize: ts(11) }}
                          >
                            {value}
                          </span>
                          {/* The gateway, on the row that pays. */}
                          {i === 1 && (
                            <span
                              className="border-hair text-brand-700 shrink-0 rounded-full border font-semibold tracking-[0.08em] uppercase"
                              style={{
                                fontSize: ts(9),
                                padding: `${cq(2)} ${cq(6)}`,
                              }}
                            >
                              {GATEWAY}
                            </span>
                          )}
                        </span>
                      </span>
                    ))}
                  </span>

                  <span
                    className="border-hair flex items-center justify-between border-t"
                    style={{ marginTop: cq(12), paddingTop: cq(10) }}
                  >
                    <span
                      className="text-ink-soft"
                      style={{ fontSize: ts(11) }}
                    >
                      {TOTAL_LABEL}
                    </span>
                    <span
                      className="text-ink font-semibold tabular-nums"
                      style={{ fontSize: ts(12) }}
                    >
                      {CART_TOTAL}
                    </span>
                  </span>

                  <span
                    className={
                      sold ? "bg-brand-600 block" : "bg-brand-200 block"
                    }
                    style={{
                      height: cq(26),
                      marginTop: cq(10),
                      borderRadius: 999,
                    }}
                  />
                  <span
                    className="text-muted block tabular-nums"
                    style={{
                      fontSize: ts(10),
                      marginTop: cq(8),
                      opacity: sold ? 1 : 0,
                    }}
                  >
                    {ORDER_ID}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </BrowserChrome>
      </motion.div>

      {/* What has to hold up on launch day. */}
      <Figure
        label={SESSIONS_LABEL}
        value={SESSIONS}
        x={20}
        playing={playing}
        float={{ amplitude: 3, period: 14, phase: 0.2 }}
      />
      <Figure
        label={INVENTORY_LABEL}
        value={sold ? STOCK_SOLD : STOCK_HELD}
        accent
        x={188}
        playing={playing}
        float={{ amplitude: 3, period: 16, phase: 0.55 }}
      />
    </div>
  );
}

/**
 * One operational figure.
 *
 * The labels are two words each and would wrap at this width, so the panel is
 * sized for two lines rather than the one the wide canvas gets away with — the
 * alternative was abbreviating "Active Sessions", which is not a phrase that
 * abbreviates.
 */
function Figure({
  label,
  value,
  accent = false,
  x,
  playing,
  float,
}: {
  label: string;
  value: string;
  accent?: boolean;
  x: number;
  playing: boolean;
  float: { amplitude: number; period: number; phase: number };
}) {
  return (
    <FloatPanel
      playing={playing}
      float={float}
      className="absolute flex flex-col justify-center"
      style={{
        left: px(x),
        top: py(STATS.y),
        width: px(STATS.w),
        height: py(STATS.h),
        padding: `0 ${cq(14)}`,
        borderRadius: "clamp(0.625rem, 4.444cqw, 1.25rem)",
        zIndex: 30,
      }}
    >
      <span className="text-ink-soft block" style={{ fontSize: ts(11) }}>
        {label}
      </span>
      <motion.span
        className={
          accent
            ? "font-display text-brand-600 block leading-none font-semibold tracking-tight tabular-nums"
            : "font-display text-ink block leading-none font-semibold tracking-tight tabular-nums"
        }
        style={{ fontSize: ts(20), marginTop: cq(8) }}
        key={value}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE.out }}
      >
        {value}
      </motion.span>
    </FloatPanel>
  );
}
