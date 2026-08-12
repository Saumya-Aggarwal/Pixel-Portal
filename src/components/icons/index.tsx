import type { IconName } from "@/types/content";

/**
 * Hand-authored icon set (SOW §1, "custom iconography").
 *
 * One geometric system: 24x24 box, 1.5 stroke, round caps and joins, drawn on
 * a consistent grid so the set reads as a family rather than assorted clip art.
 * All strokes use currentColor, so colour is a text-colour decision at the
 * call site. lucide-react is reserved for generic UI chrome (chevrons, close).
 */

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

function Svg({ size = 24, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

const Megaphone = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 10.5v3a1.5 1.5 0 0 0 1.5 1.5H7l7 4.5V6L7 10.5H4.5A1.5 1.5 0 0 0 3 12" />
    <path d="M17 9a4 4 0 0 1 0 6" />
    <path d="M7 15v4.5h2.5" />
  </Svg>
);

const Browser = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <path d="M3 9h18" />
    <path d="M6.5 6.5h.01M9 6.5h.01" />
  </Svg>
);

const Terminal = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <path d="m7.5 10 2.5 2.5-2.5 2.5" />
    <path d="M13 15.5h3.5" />
  </Svg>
);

const Share = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="18" cy="5.5" r="2.5" />
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="18.5" r="2.5" />
    <path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1" />
  </Svg>
);

const Target = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
  </Svg>
);

const Search = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.5 15.5 4.5 4.5" />
  </Svg>
);

const Envelope = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.5 7 7.3 5.2a2 2 0 0 0 2.4 0L20.5 7" />
  </Svg>
);

const Chart = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 20V4" />
    <path d="M4 20h16" />
    <path d="M8 16.5v-4M12.5 16.5v-8M17 16.5v-5.5" />
  </Svg>
);

const Layers = (p: IconProps) => (
  <Svg {...p}>
    <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" />
    <path d="m3.5 12.5 8.5 4.5 8.5-4.5" />
    <path d="m3.5 16.5 8.5 4.5 8.5-4.5" />
  </Svg>
);

const Cart = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 4h2.2l2.3 10.5h9.6L19 7.5H6.2" />
    <circle cx="9" cy="19" r="1.5" />
    <circle cx="17" cy="19" r="1.5" />
  </Svg>
);

const Grid = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </Svg>
);

const Bolt = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13.5 3 5.5 13.5h5.2L10 21l8.2-10.7h-5.3L13.5 3Z" />
  </Svg>
);

const Device = (p: IconProps) => (
  <Svg {...p}>
    <rect x="7" y="3" width="10" height="18" rx="2.5" />
    <path d="M10.5 18h3" />
  </Svg>
);

const App = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
    <path d="M3.5 9h17" />
    <path d="M9 9v11" />
  </Svg>
);

const Gauge = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 17a8.5 8.5 0 1 1 16 0" />
    <path d="m12 17 4-5.5" />
    <circle cx="12" cy="17" r="1.2" fill="currentColor" stroke="none" />
  </Svg>
);

const Database = (p: IconProps) => (
  <Svg {...p}>
    <ellipse cx="12" cy="6" rx="7.5" ry="3" />
    <path d="M4.5 6v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6" />
    <path d="M4.5 12v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" />
  </Svg>
);

const Plug = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 3v5M15 3v5" />
    <path d="M6.5 8h11v3a5.5 5.5 0 0 1-11 0V8Z" />
    <path d="M12 16.5V21" />
  </Svg>
);

const registry: Record<IconName, (p: IconProps) => React.JSX.Element> = {
  megaphone: Megaphone,
  browser: Browser,
  terminal: Terminal,
  share: Share,
  target: Target,
  search: Search,
  envelope: Envelope,
  chart: Chart,
  layers: Layers,
  cart: Cart,
  grid: Grid,
  bolt: Bolt,
  device: Device,
  app: App,
  gauge: Gauge,
  database: Database,
  plug: Plug,
};

export function Icon({ name, ...props }: IconProps & { name: IconName }) {
  const Component = registry[name];
  return <Component {...props} />;
}
