"use client";

import { useId } from "react";

import { cn } from "@/lib/cn";

/**
 * Form controls for the questionnaire.
 *
 * All of them wrap real inputs. The selection cards look like buttons but are
 * genuine checkbox/radio inputs kept in the accessibility tree and visually
 * replaced via `has-[:checked]`, so keyboard navigation, grouping, and
 * screen-reader semantics come for free instead of being reimplemented.
 */

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-brand-800 mt-2 text-[0.8125rem]">
      {message}
    </p>
  );
}

const controlBase =
  "w-full rounded-xl border bg-white px-4 py-3.5 text-[1rem] text-ink placeholder:text-muted/60 transition-colors duration-200 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15";

export function TextField({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  optional,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  optional?: boolean;
  autoComplete?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="text-ink block text-[0.875rem] font-medium">
        {label}
        {optional && <span className="text-muted ml-1.5 font-normal">(optional)</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={cn(controlBase, "mt-2", error ? "border-brand-700" : "border-hair")}
      />
      <ErrorText id={errorId} message={error} />
    </div>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  error,
  placeholder,
  rows = 6,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  rows?: number;
  hint?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div>
      <label htmlFor={id} className="text-ink block text-[0.875rem] font-medium">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-muted mt-1 text-[0.8125rem]">
          {hint}
        </p>
      )}
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(error && errorId, hint && hintId) || undefined}
        onChange={(event) => onChange(event.target.value)}
        className={cn(controlBase, "mt-2 resize-y", error ? "border-brand-700" : "border-hair")}
      />
      <ErrorText id={errorId} message={error} />
    </div>
  );
}

const cardBase = cn(
  "relative flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all duration-300",
  "border-hair bg-white hover:border-brand-300 hover:bg-brand-50/40",
  "has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 has-[:checked]:shadow-lift",
  "has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-500/20",
);

/** Checkbox card — multi-select. */
export function CheckCard({
  name,
  value,
  checked,
  onToggle,
  title,
  description,
}: {
  name: string;
  value: string;
  checked: boolean;
  onToggle: (value: string) => void;
  title: string;
  description?: string;
}) {
  return (
    <label className={cardBase}>
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onToggle(value)}
        className="sr-only"
      />
      <Indicator checked={checked} shape="square" />
      <span className="min-w-0">
        <span className="text-ink block text-[0.9375rem] font-medium">{title}</span>
        {description && (
          <span className="text-muted mt-1 block text-[0.8125rem] leading-snug">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

/** Radio card — single select. */
export function RadioCard({
  name,
  value,
  checked,
  onSelect,
  title,
}: {
  name: string;
  value: string;
  checked: boolean;
  onSelect: (value: string) => void;
  title: string;
}) {
  return (
    <label className={cn(cardBase, "items-center")}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onSelect(value)}
        className="sr-only"
      />
      <Indicator checked={checked} shape="circle" />
      <span className="text-ink text-[0.9375rem] font-medium">{title}</span>
    </label>
  );
}

function Indicator({ checked, shape }: { checked: boolean; shape: "square" | "circle" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "mt-0.5 grid h-5 w-5 shrink-0 place-items-center border transition-colors duration-200",
        shape === "square" ? "rounded-md" : "rounded-full",
        checked ? "border-brand-500 bg-brand-500" : "border-hair bg-white",
      )}
    >
      {checked &&
        (shape === "square" ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6.2 4.8 8.5 9.5 3.8"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        ))}
    </span>
  );
}

/** Group wrapper — real fieldset/legend so the question is announced once. */
export function FieldGroup({
  legend,
  hint,
  error,
  children,
  className,
}: {
  legend: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <fieldset>
      <legend className="text-ink text-[0.875rem] font-medium">{legend}</legend>
      {hint && <p className="text-muted mt-1 text-[0.8125rem]">{hint}</p>}
      <div className={cn("mt-3 grid gap-2.5", className)}>{children}</div>
      <ErrorText id={`${id}-error`} message={error} />
    </fieldset>
  );
}
