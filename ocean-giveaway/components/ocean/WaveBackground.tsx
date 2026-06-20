import { TurtleIcon, FishIcon } from "./icons";

const TURTLES = [
  { top: "14%", size: 24, duration: "34s", delay: "0s", opacity: 0.2 },
  { top: "58%", size: 32, duration: "44s", delay: "9s", opacity: 0.15 },
  { top: "36%", size: 18, duration: "50s", delay: "5s", opacity: 0.22 },
  { top: "78%", size: 26, duration: "38s", delay: "16s", opacity: 0.16 },
];

const FISH = [
  { top: "26%", size: 14, duration: "26s", delay: "3s", opacity: 0.2 },
  { top: "68%", size: 16, duration: "30s", delay: "12s", opacity: 0.18 },
];

const BUBBLES = [
  { left: "6%", size: 6, duration: "9s", delay: "0s" },
  { left: "18%", size: 4, duration: "7s", delay: "2s" },
  { left: "31%", size: 8, duration: "11s", delay: "1s" },
  { left: "44%", size: 5, duration: "8s", delay: "4.5s" },
  { left: "58%", size: 7, duration: "10s", delay: "3s" },
  { left: "71%", size: 4, duration: "7.5s", delay: "5.5s" },
  { left: "84%", size: 6, duration: "9.5s", delay: "6.5s" },
  { left: "93%", size: 5, duration: "8.5s", delay: "1.5s" },
];

export function WaveBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-ocean-900 via-ocean-700 to-ocean-500">
      <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-ocean-300/20 blur-3xl" />

      {BUBBLES.map((b, i) => (
        <span
          key={`bubble-${i}`}
          aria-hidden="true"
          className="absolute bottom-0 rounded-full bg-ocean-foam/40 animate-bubble-rise"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            animationDuration: b.duration,
            animationDelay: b.delay,
          }}
        />
      ))}

      {FISH.map((f, i) => (
        <span
          key={`fish-${i}`}
          aria-hidden="true"
          className="absolute text-ocean-foam animate-swim"
          style={{
            top: f.top,
            opacity: f.opacity,
            animationDuration: f.duration,
            animationDelay: f.delay,
          }}
        >
          <FishIcon size={f.size} />
        </span>
      ))}

      {TURTLES.map((t, i) => (
        <span
          key={`turtle-${i}`}
          aria-hidden="true"
          className="absolute text-ocean-foam animate-swim"
          style={{
            top: t.top,
            opacity: t.opacity,
            animationDuration: t.duration,
            animationDelay: t.delay,
          }}
        >
          <TurtleIcon size={t.size} />
        </span>
      ))}

      <svg
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-64 w-[200%] animate-drift-slow text-ocean-foam/10"
        viewBox="0 0 2880 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,224 C240,288 480,160 720,192 C960,224 1200,320 1440,288 C1680,256 1920,160 2160,192 C2400,224 2640,288 2880,256 L2880,320 L0,320 Z M1440,224 C1680,288 1920,160 2160,192 C2400,224 2640,320 2880,288 C3120,256 3360,160 3600,192 C3840,224 4080,288 4320,256 L4320,320 L1440,320 Z"
        />
      </svg>
      <svg
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-48 w-[200%] animate-drift text-ocean-foam/15"
        viewBox="0 0 2880 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,256 C320,192 640,288 960,256 C1280,224 1600,160 1920,192 C2240,224 2560,288 2880,240 L2880,320 L0,320 Z M1440,256 C1760,192 2080,288 2400,256 C2720,224 3040,160 3360,192 C3680,224 4000,288 4320,240 L4320,320 L1440,320 Z"
        />
      </svg>
    </div>
  );
}
