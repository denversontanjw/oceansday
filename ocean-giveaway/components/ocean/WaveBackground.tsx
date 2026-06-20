import { TurtleIcon, FishIcon, JellyfishIcon, StarfishIcon, SeahorseIcon } from "./icons";

// Turtles stay in shades of green/emerald (true to actual sea turtles) so
// "more colourful" applies to the rest of the marine life instead, which
// reads more deliberately designed than making everything rainbow.
const TURTLES = [
  { top: "10%", size: 44, duration: "30s", delay: "0s", opacity: 0.55, color: "text-emerald-300" },
  { top: "52%", size: 56, duration: "42s", delay: "8s", opacity: 0.5, color: "text-green-500" },
  { top: "30%", size: 36, duration: "48s", delay: "4s", opacity: 0.6, color: "text-emerald-400" },
  { top: "74%", size: 48, duration: "36s", delay: "14s", opacity: 0.5, color: "text-green-600" },
  { top: "20%", size: 38, duration: "40s", delay: "20s", opacity: 0.55, color: "text-emerald-500" },
  { top: "86%", size: 30, duration: "33s", delay: "11s", opacity: 0.5, color: "text-green-400" },
];

const FISH = [
  { top: "40%", size: 22, duration: "24s", delay: "3s", opacity: 0.45, color: "text-sand" },
  { top: "64%", size: 26, duration: "28s", delay: "12s", opacity: 0.4, color: "text-coral" },
  { top: "88%", size: 18, duration: "22s", delay: "7s", opacity: 0.42, color: "text-ocean-foam" },
  { top: "8%", size: 20, duration: "26s", delay: "16s", opacity: 0.4, color: "text-sand" },
];

// Bob gently in place rather than swimming across.
const JELLYFISH = [
  { left: "12%", top: "22%", size: 30, duration: "7s", delay: "0s", opacity: 0.4, color: "text-ocean-foam" },
  { left: "78%", top: "46%", size: 24, duration: "8s", delay: "2s", opacity: 0.4, color: "text-ocean-300" },
  { left: "55%", top: "16%", size: 20, duration: "6.5s", delay: "4s", opacity: 0.35, color: "text-sand" },
];

const SEAHORSES = [
  { left: "28%", top: "62%", size: 26, duration: "7.5s", delay: "1s", opacity: 0.45, color: "text-sand" },
  { left: "85%", top: "26%", size: 22, duration: "6.8s", delay: "3.5s", opacity: 0.4, color: "text-seagrass" },
];

// Resting on the seafloor — no animation, since real starfish don't swim.
const STARFISH = [
  { left: "6%", bottom: "4%", size: 20, rotate: "-8deg", opacity: 0.4, color: "text-coral" },
  { left: "90%", bottom: "7%", size: 16, rotate: "12deg", opacity: 0.35, color: "text-sand" },
  { left: "48%", bottom: "2%", size: 14, rotate: "4deg", opacity: 0.3, color: "text-coral" },
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
  { left: "12%", size: 5, duration: "8.2s", delay: "7.5s" },
  { left: "65%", size: 4, duration: "7.8s", delay: "8.2s" },
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
          style={{ left: b.left, width: b.size, height: b.size, animationDuration: b.duration, animationDelay: b.delay }}
        />
      ))}

      {STARFISH.map((s, i) => (
        <span
          key={`starfish-${i}`}
          aria-hidden="true"
          className={`absolute ${s.color} drop-shadow-md`}
          style={{ left: s.left, bottom: s.bottom, opacity: s.opacity, transform: `rotate(${s.rotate})` }}
        >
          <StarfishIcon size={s.size} />
        </span>
      ))}

      {SEAHORSES.map((s, i) => (
        <span
          key={`seahorse-${i}`}
          aria-hidden="true"
          className={`absolute ${s.color} animate-float drop-shadow-md`}
          style={{ left: s.left, top: s.top, opacity: s.opacity, animationDuration: s.duration, animationDelay: s.delay }}
        >
          <SeahorseIcon size={s.size} />
        </span>
      ))}

      {JELLYFISH.map((j, i) => (
        <span
          key={`jellyfish-${i}`}
          aria-hidden="true"
          className={`absolute ${j.color} animate-float drop-shadow-md`}
          style={{ left: j.left, top: j.top, opacity: j.opacity, animationDuration: j.duration, animationDelay: j.delay }}
        >
          <JellyfishIcon size={j.size} />
        </span>
      ))}

      {FISH.map((f, i) => (
        <span
          key={`fish-${i}`}
          aria-hidden="true"
          className={`absolute ${f.color} animate-swim drop-shadow-md`}
          style={{ top: f.top, opacity: f.opacity, animationDuration: f.duration, animationDelay: f.delay }}
        >
          <FishIcon size={f.size} />
        </span>
      ))}

      {TURTLES.map((t, i) => (
        <span
          key={`turtle-${i}`}
          aria-hidden="true"
          className={`absolute ${t.color} animate-swim drop-shadow-md`}
          style={{ top: t.top, opacity: t.opacity, animationDuration: t.duration, animationDelay: t.delay }}
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
