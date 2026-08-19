"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useReducer, useRef, useState } from "react";

import { CheckCard, FieldGroup, RadioCard, TextArea, TextField } from "@/components/contact/Fields";
import { ArrowGlyph, Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { DUR, EASE, SPRING } from "@/lib/motion";
import {
  BUDGETS,
  STEP_FIELDS,
  TIMELINES,
  validateStep,
  type FieldErrors,
  type Inquiry,
} from "@/lib/schemas/inquiry";
import type { Category } from "@/types/content";
import { useReducedMotion } from "@/lib/useReducedMotion";

type FormState = {
  services: string[];
  scope: string;
  website: string;
  budget: string;
  timeline: string;
  name: string;
  email: string;
  company: string;
  phone: string;
};

const initialState: FormState = {
  services: [],
  scope: "",
  website: "",
  budget: "",
  timeline: "",
  name: "",
  email: "",
  company: "",
  phone: "",
};

type Action =
  | { type: "set"; field: keyof FormState; value: string }
  | { type: "toggleService"; value: string };

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case "set":
      return { ...state, [action.field]: action.value };
    case "toggleService":
      return {
        ...state,
        services: state.services.includes(action.value)
          ? state.services.filter((s) => s !== action.value)
          : [...state.services, action.value],
      };
  }
}

const STEPS = [
  { title: "What do you need?", hint: "Pick everything that applies." },
  { title: "Tell us about the project", hint: "The problem matters more than the spec." },
  { title: "Budget and timing", hint: "Rough is fine — it helps us scope honestly." },
  { title: "How do we reach you?", hint: "We reply within one working day." },
  { title: "Review and send", hint: "Last look before it lands with us." },
];

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Multi-step onboarding questionnaire (SOW §2, "interactive onboarding
 * questionnaire").
 *
 * Notable decisions:
 *
 * - **Validation comes from the shared Zod schema**, picked per step, so the
 *   form and `/api/inquiry` cannot disagree about what is valid.
 * - **Direction-aware transitions.** The panel slides in from the side you
 *   came from, so forward and backward feel different. A single fade would
 *   lose the sense of place in a five-step flow.
 * - **Focus moves to the step heading** on each change. Without it, keyboard
 *   and screen-reader users stay parked on a "Continue" button that has just
 *   been re-rendered under new content.
 * - **The panel is not a `<form>` per step** — one form wraps everything, and
 *   only the final step submits, so a stray Enter keypress advances rather
 *   than submitting a half-filled inquiry.
 */
export function InquiryStepper({ categories }: { categories: Category[] }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const prefersReduced = useReducedMotion();

  const isReview = step === STEPS.length - 1;

  const focusHeading = useCallback(() => {
    // rAF so focus lands after the incoming panel has mounted.
    requestAnimationFrame(() => headingRef.current?.focus());
  }, []);

  const goTo = useCallback(
    (next: number, dir: number) => {
      setDirection(dir);
      setStep(next);
      setErrors({});
      focusHeading();
    },
    [focusHeading],
  );

  const handleNext = useCallback(() => {
    const stepErrors = validateStep(step, state as Partial<Inquiry>);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    goTo(Math.min(step + 1, STEPS.length - 1), 1);
  }, [step, state, goTo]);

  const handleBack = useCallback(() => {
    goTo(Math.max(step - 1, 0), -1);
  }, [step, goTo]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!isReview || status === "submitting") return;

      setStatus("submitting");
      setServerError(null);

      try {
        const response = await fetch("/api/inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(state),
        });
        const data = await response.json();

        if (!response.ok) {
          setStatus("error");
          setServerError(data.error ?? "Something went wrong. Please try again.");
          // Server-side field errors mean an earlier step is wrong; send the
          // visitor back to it rather than stranding them on the review panel.
          if (data.fieldErrors) {
            const bad = Object.keys(data.fieldErrors)[0] as keyof Inquiry;
            const badStep = STEP_FIELDS.findIndex((fields) =>
              (fields as readonly string[]).includes(bad),
            );
            if (badStep >= 0) {
              setErrors(data.fieldErrors);
              setDirection(-1);
              setStep(badStep);
              focusHeading();
            }
          }
          return;
        }

        setStatus("success");
      } catch {
        setStatus("error");
        setServerError("We could not reach the server. Please check your connection.");
      }
    },
    [isReview, state, status, focusHeading],
  );

  if (status === "success") {
    return <SuccessPanel name={state.name} />;
  }

  const slide = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, x: direction * 32 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: direction * -32 },
        transition: { duration: DUR.base, ease: EASE.out },
      };

  return (
    <div className="border-hair rounded-panel border bg-white p-6 shadow-lift sm:p-9 lg:p-11">
      <ProgressRail step={step} total={STEPS.length} onJump={(i) => goTo(i, i > step ? 1 : -1)} />

      <form onSubmit={handleSubmit} noValidate className="mt-9">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={step} {...slide}>
            <p className="text-eyebrow text-brand-700 uppercase">
              Step {step + 1} of {STEPS.length}
            </p>
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="font-display text-ink mt-3 text-[clamp(1.5rem,3vw,2rem)] leading-tight font-semibold tracking-tight outline-none"
            >
              {STEPS[step].title}
            </h2>
            <p className="text-muted mt-2 text-[0.9375rem]">{STEPS[step].hint}</p>

            <div className="mt-8">
              {step === 0 && (
                <div className="space-y-7">
                  {categories.map((category) => (
                    <FieldGroup
                      key={category.slug}
                      legend={category.title}
                      error={
                        category.slug === categories[0].slug
                          ? errors.services?.[0]
                          : undefined
                      }
                      className="sm:grid-cols-2"
                    >
                      {category.services.map((service) => (
                        <CheckCard
                          key={service.slug}
                          name="services"
                          value={service.slug}
                          checked={state.services.includes(service.slug)}
                          onToggle={(value) => dispatch({ type: "toggleService", value })}
                          title={service.navTitle ?? service.title}
                          description={service.tagline}
                        />
                      ))}
                    </FieldGroup>
                  ))}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <TextArea
                    label="What are you trying to achieve?"
                    hint="What is the problem, who is it hurting, and what does success look like?"
                    value={state.scope}
                    onChange={(value) => dispatch({ type: "set", field: "scope", value })}
                    error={errors.scope?.[0]}
                    placeholder="We are launching in a new market and our current site cannot support localised content…"
                  />
                  <TextField
                    label="Current website"
                    optional
                    type="url"
                    autoComplete="url"
                    value={state.website}
                    onChange={(value) => dispatch({ type: "set", field: "website", value })}
                    error={errors.website?.[0]}
                    placeholder="https://"
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <FieldGroup
                    legend="Approximate budget"
                    error={errors.budget?.[0]}
                    className="sm:grid-cols-2"
                  >
                    {BUDGETS.map((budget) => (
                      <RadioCard
                        key={budget}
                        name="budget"
                        value={budget}
                        checked={state.budget === budget}
                        onSelect={(value) => dispatch({ type: "set", field: "budget", value })}
                        title={budget}
                      />
                    ))}
                  </FieldGroup>

                  <FieldGroup
                    legend="When do you want to start?"
                    error={errors.timeline?.[0]}
                    className="sm:grid-cols-2"
                  >
                    {TIMELINES.map((timeline) => (
                      <RadioCard
                        key={timeline}
                        name="timeline"
                        value={timeline}
                        checked={state.timeline === timeline}
                        onSelect={(value) => dispatch({ type: "set", field: "timeline", value })}
                        title={timeline}
                      />
                    ))}
                  </FieldGroup>
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    label="Your name"
                    autoComplete="name"
                    value={state.name}
                    onChange={(value) => dispatch({ type: "set", field: "name", value })}
                    error={errors.name?.[0]}
                  />
                  <TextField
                    label="Company"
                    autoComplete="organization"
                    value={state.company}
                    onChange={(value) => dispatch({ type: "set", field: "company", value })}
                    error={errors.company?.[0]}
                  />
                  <TextField
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={state.email}
                    onChange={(value) => dispatch({ type: "set", field: "email", value })}
                    error={errors.email?.[0]}
                  />
                  <TextField
                    label="Phone"
                    optional
                    type="tel"
                    autoComplete="tel"
                    value={state.phone}
                    onChange={(value) => dispatch({ type: "set", field: "phone", value })}
                    error={errors.phone?.[0]}
                  />
                </div>
              )}

              {isReview && (
                <ReviewPanel state={state} categories={categories} onEdit={(i) => goTo(i, -1)} />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {serverError && (
            <motion.div
              key="server-error"
              initial={prefersReduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: DUR.fast, ease: EASE.soft }}
              className="overflow-hidden"
            >
              <p
                role="alert"
                className="border-brand-200 bg-brand-50 text-brand-900 mt-6 rounded-xl border px-4 py-3 text-[0.875rem]"
              >
                {serverError}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="border-hair mt-9 flex items-center justify-between gap-4 border-t pt-6">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0}
            className="text-muted hover:text-brand-700 inline-flex min-h-11 items-center text-[0.9375rem] transition-colors disabled:pointer-events-none disabled:opacity-0"
          >
            Back
          </button>

          {isReview ? (
            <Button type="submit" size="lg" className="group" disabled={status === "submitting"}>
              {status === "submitting" ? "Sending…" : "Send enquiry"}
              <ArrowGlyph />
            </Button>
          ) : (
            <Button type="button" size="lg" className="group" onClick={handleNext}>
              Continue
              <ArrowGlyph />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function ProgressRail({
  step,
  total,
  onJump,
}: {
  step: number;
  total: number;
  onJump: (index: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5" role="list" aria-label="Progress">
        {Array.from({ length: total }).map((_, index) => (
          <button
            key={index}
            type="button"
            role="listitem"
            // Only completed steps are reachable — jumping ahead would skip
            // the validation that gates each one.
            disabled={index > step}
            onClick={() => onJump(index)}
            aria-current={index === step ? "step" : undefined}
            aria-label={`Step ${index + 1}${index < step ? " (completed)" : ""}`}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-500",
              index < step && "bg-brand-500 cursor-pointer",
              index === step && "bg-brand-700",
              index > step && "bg-hair cursor-default",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function ReviewPanel({
  state,
  categories,
  onEdit,
}: {
  state: FormState;
  categories: Category[];
  onEdit: (step: number) => void;
}) {
  const allServices = categories.flatMap((c) => c.services);
  const chosen = state.services
    .map((slug) => allServices.find((s) => s.slug === slug))
    .filter(Boolean)
    .map((s) => s!.navTitle ?? s!.title);

  const rows: { label: string; value: string; step: number }[] = [
    { label: "Services", value: chosen.join(", ") || "—", step: 0 },
    { label: "Project", value: state.scope, step: 1 },
    { label: "Website", value: state.website || "—", step: 1 },
    { label: "Budget", value: state.budget, step: 2 },
    { label: "Timeline", value: state.timeline, step: 2 },
    { label: "Name", value: state.name, step: 3 },
    { label: "Company", value: state.company, step: 3 },
    { label: "Email", value: state.email, step: 3 },
    { label: "Phone", value: state.phone || "—", step: 3 },
  ];

  return (
    <dl className="divide-hair border-hair divide-y border-y">
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-3 gap-4 py-4">
          <dt className="text-muted text-[0.875rem]">{row.label}</dt>
          <dd className="text-ink col-span-2 flex items-start justify-between gap-4 text-[0.9375rem]">
            <span className="min-w-0 break-words whitespace-pre-wrap">{row.value}</span>
            <button
              type="button"
              onClick={() => onEdit(row.step)}
              className="text-brand-700 hover:text-brand-900 shrink-0 text-[0.8125rem] underline underline-offset-4"
            >
              Edit<span className="sr-only"> {row.label}</span>
            </button>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function SuccessPanel({ name }: { name: string }) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      role="status"
      initial={prefersReduced ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DUR.base, ease: EASE.out }}
      className="border-hair rounded-panel shadow-lift border bg-white p-10 text-center sm:p-14"
    >
      <motion.span
        className="bg-brand-50 text-brand-600 mx-auto grid h-16 w-16 place-items-center rounded-full"
        initial={prefersReduced ? false : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={prefersReduced ? undefined : { ...SPRING.lift, delay: 0.15 }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="m5 12.5 4.5 4.5L19 7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.span>
      <h2 className="font-display text-ink mt-7 text-[clamp(1.5rem,3vw,2.25rem)] font-semibold tracking-tight">
        Thanks{name ? `, ${name.split(" ")[0]}` : ""} — that is with us.
      </h2>
      <p className="text-muted mx-auto mt-4 max-w-md text-[0.9375rem] leading-relaxed">
        Someone from the team will read it properly and reply within one working day. If it is
        urgent, call the Gurgaon studio directly.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Button href="/case-studies" variant="outline" className="group">
          Read a case study
          <ArrowGlyph />
        </Button>
        <Button href="/" variant="ghost">
          Back to home
        </Button>
      </div>
    </motion.div>
  );
}
