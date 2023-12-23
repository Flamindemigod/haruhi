import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
  darkMode: "class",
  safelist: [
    "text-primary-500",
    "bg-primary-500",
    "bg-red-400",
    "bg-orange-400",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-600",
    "bg-cyan-500",
    "bg-sky-600",
    "bg-blue-400",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-fuschia-400",
    "bg-pink-500",
    "bg-rose-400",
  ],
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      gridTemplateColumns: {
        mNavContainer:
          "1fr 1fr [search-start] theme(width.16) [search-end] 1fr 1fr",
      },
      backgroundSize: {
        "500%": "500%",
      },
      keyframes: {
        bg_travel_x: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "100% 100%" },
        },
        color_morph: {
          "0%": { color: "theme(colors.primary.500)" },
          "100%": { color: "theme(colors.secondary.500)" },
        },
        bannerMove: {
          "0%": {
            objectPosition: "left top",
          },
          "100%": {
            objectPosition: "right bottom",
          },
        },
      },
      animation: {
        "banner-move-s": "bannerMove 30s alternate infinite linear",
        "banner-move-f": "bannerMove 20s alternate infinite linear",
        "bg-travel-y": "bg_travel_x 10s ease-in-out infinite alternate",
        color_morph: "color_morph 10s ease-in-out infinite alternate",
      },
      fontFamily: {
        georama: ["Georama", "sans-serif"],
      },
      colors: {
        secondary: {
          100: "#d9edfd",
          200: "#b3dbfb",
          300: "#8ec9f9",
          400: "#68b7f7",
          500: "#42a5f5",
          600: "#3584c4",
          700: "#286393",
          800: "#1a4262",
          900: "#0d2131",
        },
        primary: {
          100: "#f4cce1",
          200: "#ea99c4",
          300: "#df66a6",
          400: "#d53389",
          500: "#ca006b",
          600: "#a20056",
          700: "#790040",
          800: "#51002b",
          900: "#280015",
        },
        offWhite: {
          50: "#efefef",
          100: "#d5d5d5",
          200: "#ababab",
          300: "#828282",
          400: "#585858",
          500: "#2e2e2e",
          600: "#252525",
          700: "#1c1c1c",
          800: "#121212",
          900: "#090909",
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-radix")(),
    require("@tailwindcss/container-queries"),
  ],
} satisfies Config;
