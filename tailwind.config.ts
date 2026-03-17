import type { Config } from "tailwindcss";

const config: Config = {
  corePlugins: {
    preflight: false,
  },
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e7f0ff",
          100: "#c6dbff",
          200: "#9cbfff",
          300: "#719fff",
          400: "#4b83f5",
          500: "#2b68de",
          600: "#0149bc",
          700: "#013a98",
          800: "#012d74",
          900: "#001f50",
          950: "#001233",
        },
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-50% - var(--gap) / 2))" },
        },
      },
      animation: {
        marquee: "marquee var(--duration, 30s) linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
