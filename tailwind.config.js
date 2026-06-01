/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          900: "#070a12",
          800: "#0b1020",
          700: "#111733",
          glass: "rgba(18,22,34,0.72)",
        },
        accent: {
          DEFAULT: "#6ea8fe",
          violet: "#b692ff",
          green: "#39d98a",
          amber: "#f4b740",
          rose: "#ff7a90",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      keyframes: {
        ripple: {
          "0%": { transform: "scale(0.7)", opacity: "0.6" },
          "100%": { transform: "scale(2.8)", opacity: "0" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        glow: {
          "0%,100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        ripple: "ripple 0.9s ease-out forwards",
        floaty: "floaty 6s ease-in-out infinite",
        glow: "glow 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
