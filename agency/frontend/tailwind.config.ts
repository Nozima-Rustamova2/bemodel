import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF", // page background (also the light text colour on dark surfaces)
        bgAlt: "#FFFFFF", // alternating section background
        panel: "#E1D8F5", // soft lavender panel - replaces the old dark-velvet sections
        ink: "#17121F", // primary text / dark sections (near-black from logo wordmark)
        inkSoft: "#655C78", // body text on light
        inkSofter: "#3D3550", // muted body (more legible/darker)
        taupe: "#8478A0", // labels / secondary text
        mutedLight: "#B0A5CC",
        hairline: "rgba(23, 18, 31, 0.12)",
        accent: "#6C55B0", // violet accent
        accentDeep: "#C4B3EE", // light lilac, for use on dark sections
        paperText: "#F5F2FC", // light text on dark/photo backgrounds
        placeholder: "#E6DFF6", // empty image slot fill
        polaroid: "#FDFCFF",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        body: ["var(--font-jost)", "sans-serif"],
        mono: ["'Courier New'", "monospace"],
      },
      letterSpacing: {
        widest2: "0.2em",
      },
    },
  },
  plugins: [],
};

export default config;
