export function WaveBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-ocean-900 via-ocean-700 to-ocean-500">
      {/* Soft ambient light */}
      <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-ocean-300/20 blur-3xl" />

      {/* Drifting wave layers, tiled by repeating the path twice at 200% width */}
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
