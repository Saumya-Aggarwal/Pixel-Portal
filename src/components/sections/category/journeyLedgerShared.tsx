/**
 * Shared stations, ledger math, and the mock interiors for JourneyLedger.
 *
 * Desktop and the phone stage are different compositions of the same argument,
 * so the content lives here once. Canvas unit helpers are passed in because
 * the two stages bind different boards (1440×720 vs 360×640).
 */

export const STATIONS = [
  {
    slug: "social-media-handling",
    title: "Social Media",
    eyebrow: "Touch 1 · Day 0",
    moment: "Impression",
    day: "Day 0",
    stepper: "Social",
    stat: ["Reach", "20k"],
  },
  {
    slug: "performance-ads",
    title: "Performance Ads",
    eyebrow: "Touch 2 · Day 3",
    moment: "Paid click",
    day: "Day 3",
    stepper: "Ads",
    stat: ["Avg CPC", "$1.20"],
  },
  {
    slug: "search-engine-optimization",
    title: "Search",
    eyebrow: "Touch 3 · Day 9",
    moment: "Organic return",
    day: "Day 9",
    stepper: "Search",
    stat: ["Position", "#3"],
  },
  {
    slug: "email-marketing",
    title: "Email Campaigns",
    eyebrow: "Touch 4 · Day 17",
    moment: "Nurture open",
    day: "Day 17",
    stepper: "Email",
    stat: ["Open rate", "60%"],
  },
  {
    slug: "performance-tracking-analytics",
    title: "Analytics",
    eyebrow: "Measured · Day 30",
    moment: "Converted",
    day: "Day 30",
    stepper: "Measure",
    stat: ["CPA", "$45"],
  },
] as const;

export const CHANNELS = [
  { label: "Social", share: 25 },
  { label: "Paid", share: 30 },
  { label: "Organic", share: 25 },
  { label: "Email", share: 20 },
] as const;

export const STOPS = STATIONS.map((_, i) => i / (STATIONS.length - 1));

export const ATTRIBUTED = 10_000;

export function hrefFor(slug: string) {
  return `/digital-marketing/${slug}`;
}

export type CanvasUnits = {
  cq: (v: number) => string;
  ts: (v: number) => string;
};

/**
 * TODO(content): illustrative figures inside each station's mock interface.
 */
export function StationMock({
  index,
  cq,
  ts,
}: {
  index: number;
} & CanvasUnits) {
  if (index === 0) {
    return (
      <span className="block">
        <span className="flex items-center" style={{ gap: cq(7) }}>
          <span
            className="bg-brand-100 block rounded-full"
            style={{ width: cq(18), height: cq(18) }}
          />
          <span
            className="bg-hair block rounded-full"
            style={{ width: cq(60), height: cq(5) }}
          />
        </span>
        <span
          className="bg-brand-50 block rounded-md"
          style={{ height: cq(62), marginTop: cq(9) }}
        />
        <span
          className="text-muted block"
          style={{ fontSize: ts(10), marginTop: cq(9) }}
        >
          45 likes · 2 comments
        </span>
      </span>
    );
  }

  if (index === 1) {
    return (
      <span className="block">
        <span
          className="flex items-end justify-between"
          style={{ height: cq(72) }}
        >
          {[26, 38, 32, 50, 44, 66].map((bar, i) => (
            <span
              key={bar}
              className={
                i === 5
                  ? "bg-brand-500 block rounded-t-sm"
                  : "bg-brand-200 block rounded-t-sm"
              }
              style={{ width: cq(22), height: cq(bar) }}
            />
          ))}
        </span>
        <span
          className="bg-hair block"
          style={{ height: 1, marginTop: cq(6) }}
        />
        <span
          className="text-muted block"
          style={{ fontSize: ts(10), marginTop: cq(9) }}
        >
          Impressions · 7 days
        </span>
      </span>
    );
  }

  if (index === 2) {
    return (
      <span className="block">
        <span
          className="border-hair text-ink-soft flex items-center rounded-full border bg-white"
          style={{ height: cq(26), paddingLeft: cq(11), fontSize: ts(11) }}
        >
          digital agency
        </span>
        <span className="block" style={{ marginTop: cq(12) }}>
          <span
            className="text-brand-700 block truncate"
            style={{ fontSize: ts(10) }}
          >
            pixelportal.in › services
          </span>
          <span
            className="bg-hair block rounded-full"
            style={{ width: "88%", height: cq(6), marginTop: cq(7) }}
          />
          <span
            className="bg-hair block rounded-full"
            style={{ width: "62%", height: cq(6), marginTop: cq(6) }}
          />
        </span>
      </span>
    );
  }

  if (index === 3) {
    return (
      <span className="block" style={{ display: "grid", gap: cq(7) }}>
        {[
          ["Welcome flow", true],
          ["Cart reminder", false],
          ["Monthly digest", false],
        ].map(([subject, live]) => (
          <span
            key={String(subject)}
            className={
              live
                ? "border-brand-200 bg-brand-50 flex items-center rounded-md border"
                : "border-hair flex items-center rounded-md border bg-white"
            }
            style={{ height: cq(30), padding: `0 ${cq(10)}`, gap: cq(8) }}
          >
            <span
              className={
                live
                  ? "bg-brand-500 block rounded-full"
                  : "bg-hair block rounded-full"
              }
              style={{ width: cq(5), height: cq(5) }}
            />
            <span
              className="text-ink-soft truncate"
              style={{ fontSize: ts(11) }}
            >
              {subject}
            </span>
          </span>
        ))}
      </span>
    );
  }

  // Tones are written as whole class names, never interpolated: Tailwind reads
  // source text, so a `bg-${tone}` never reaches the generated stylesheet and
  // the bar renders invisible.
  const funnel = [
    {
      label: "Sessions",
      width: "100%",
      tone: "bg-brand-200 block h-full rounded-full",
    },
    {
      label: "Engaged",
      width: "62%",
      tone: "bg-brand-300 block h-full rounded-full",
    },
    {
      label: "Converted",
      width: "24%",
      tone: "bg-brand-500 block h-full rounded-full",
    },
  ];

  return (
    <span className="block" style={{ display: "grid", gap: cq(8) }}>
      {funnel.map((row) => (
        <span key={row.label} className="block">
          <span
            className="flex items-baseline justify-between"
            style={{ marginBottom: cq(4) }}
          >
            <span className="text-muted" style={{ fontSize: ts(10) }}>
              {row.label}
            </span>
            <span
              className="text-ink-soft tabular-nums"
              style={{ fontSize: ts(10) }}
            >
              {row.width}
            </span>
          </span>
          <span
            className="bg-paper block overflow-hidden rounded-full"
            style={{ height: cq(8) }}
          >
            <span className={row.tone} style={{ width: row.width }} />
          </span>
        </span>
      ))}
    </span>
  );
}

/** Credited dollars at playhead `t`, filling with each channel's own stop. */
export function attributedAt(t: number) {
  let credited = 0;
  for (let i = 0; i < CHANNELS.length; i += 1) {
    const at = STOPS[i];
    const start = Math.max(0, at - 0.09);
    const progress = t >= at ? 1 : t <= start ? 0 : (t - start) / (at - start);
    credited += progress * (CHANNELS[i].share / 100) * ATTRIBUTED;
  }
  return Math.round(credited);
}
