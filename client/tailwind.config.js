/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0A0A0C", 50: "#141418" },
        surface: { DEFAULT: "#17171B", raised: "#1F1F25" },
        line: "#2B2B33",
        ember: { DEFAULT: "#FF5A1F", soft: "#FFA766", dim: "#C9481B" },
        ink_text: { hi: "#F5F4F2", mid: "#B4B4BE", low: "#6E6E78" },
        signal: { green: "#34D399", red: "#F87171", amber: "#FBBF24" },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        serif: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: { xl2: "1.25rem" },
      boxShadow: {
        card: "0 8px 30px -12px rgba(0,0,0,0.6)",
        glow: "0 0 0 1px rgba(255,90,31,0.25), 0 8px 24px -8px rgba(255,90,31,0.35)",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translateY(0px) rotate(var(--tilt, 0deg))" },
          "50%": { transform: "translateY(-10px) rotate(var(--tilt, 0deg))" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        drift: "drift 6s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};
