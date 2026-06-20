import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          deep: "#073b4c",
          900: "#0369a1",
          700: "#0284c7",
          500: "#0ea5e9",
          300: "#7dd3fc",
          foam: "#ecfeff",
        },
        sand: "#fef3c7",
        coral: "#f43f5e",
        seagrass: "#0d9488",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      keyframes: {
        drift: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pop: {
          "0%": { transform: "scale(0.92)", opacity: "0" },
          "60%": { transform: "scale(1.03)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        swim: {
          "0%": { left: "-12%", transform: "translateY(0) rotate(0deg)" },
          "25%": { transform: "translateY(-10px) rotate(-4deg)" },
          "45%": { transform: "translateY(-16px) rotate(2deg)" },
          "50%": { left: "50%", transform: "translateY(0) rotate(0deg)" },
          "55%": { transform: "translateY(16px) rotate(-2deg)" },
          "75%": { transform: "translateY(10px) rotate(4deg)" },
          "100%": { left: "112%", transform: "translateY(0) rotate(0deg)" },
        },
        "bubble-rise": {
          "0%": { transform: "translateY(0) scale(0.85)", opacity: "0" },
          "12%": { opacity: "0.6" },
          "85%": { opacity: "0.5" },
          "100%": { transform: "translateY(-105vh) scale(1.05)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-14px) scale(1.05)" },
        },
      },
      animation: {
        drift: "drift 18s linear infinite both",
        "drift-slow": "drift 28s linear infinite both",
        rise: "rise 0.5s ease-out forwards",
        pop: "pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        shimmer: "shimmer 2.5s linear infinite",
        swim: "swim 32s ease-in-out infinite alternate both",
        "bubble-rise": "bubble-rise 9s linear infinite both",
        float: "float 6s ease-in-out infinite both",
      },
    },
  },
  plugins: [],
};

export default config;
