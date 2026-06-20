import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(props: IconProps) {
  const { size = 24, ...rest } = props;
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...rest,
  };
}

export function TurtleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 8.5c3.6 0 6 1.9 6 4.6 0 2.6-2.6 4.4-6 4.4s-6-1.8-6-4.4c0-2.7 2.4-4.6 6-4.6Z" />
      <path d="M8.4 9.4 6 6.8M15.6 9.4 18 6.8M7 14.6l-2.6 1.2M17 14.6l2.6 1.2M9.5 17.8 9 20.4M14.5 17.8l.5 2.6" />
      <circle cx="12" cy="6.5" r="2" />
      <path d="M10 12.6c.6-.7 1.3-1 2-1s1.4.3 2 1" />
    </svg>
  );
}

export function WaveIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2 16c1.3-1.3 2.7-2 4-2s2.7.7 4 2 2.7 2 4 2 2.7-.7 4-2 2.7-2 4-2" />
      <path d="M2 11c1.3-1.3 2.7-2 4-2s2.7.7 4 2 2.7 2 4 2 2.7-.7 4-2 2.7-2 4-2" opacity="0.55" />
    </svg>
  );
}

export function BottleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M10 2.5h4M10.5 2.5v2.3c0 .4-.2.7-.5 1-1 .9-1.5 1.9-1.5 3.4v9.3c0 1.4 1 2.5 2.3 2.5h2.4c1.3 0 2.3-1.1 2.3-2.5V9.2c0-1.5-.5-2.5-1.5-3.4-.3-.3-.5-.6-.5-1V2.5" />
      <path d="M8.7 12.8h6.6" />
    </svg>
  );
}

export function MugIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 8h11v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z" />
      <path d="M16 10h1.5a2.3 2.3 0 0 1 0 4.6H16" />
      <path d="M8 5c0-.9.5-1.3.5-2M11.3 5c0-.9.5-1.3.5-2" />
    </svg>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="8.5" width="17" height="9" rx="3" />
      <path d="M7.5 8.5V7A2 2 0 0 1 9.5 5h5a2 2 0 0 1 2 2v1.5" />
      <path d="M3.5 12h17" />
    </svg>
  );
}

export function GiftIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="9.5" width="16" height="10" rx="1.5" />
      <path d="M4 13h16" />
      <path d="M12 9.5v10" />
      <path d="M12 9.5C9.5 9.5 8 8.2 8 6.6 8 5.4 8.9 4.5 10 4.5c1.6 0 2 2.3 2 5" />
      <path d="M12 9.5c2.5 0 4-1.3 4-2.9 0-1.2-.9-2.1-2-2.1-1.6 0-2 2.3-2 5" />
    </svg>
  );
}

export function FishIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2 12c2.5-3.5 7-5.5 11-5.5 3 0 5.5 1 7 2.5l2-2v10l-2-2c-1.5 1.5-4 2.5-7 2.5-4 0-8.5-2-11-5.5Z" />
      <circle cx="7.3" cy="11" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Picks an icon based on the free-text gift name stored in Supabase, so it
// keeps working even if exact wording varies (e.g. "Insulated Sports Water
// Bottle" vs "Sports Water Bottle").
export function iconForGift(gift: string | null | undefined) {
  const g = (gift ?? "").toLowerCase();
  if (g.includes("bottle")) return BottleIcon;
  if (g.includes("mug") || g.includes("cup")) return MugIcon;
  if (g.includes("bag") || g.includes("duffel") || g.includes("duffle")) return BagIcon;
  return GiftIcon;
}
