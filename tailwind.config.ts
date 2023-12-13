import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
  darkMode: 'class',
  safelist: ["text-primary-500"],
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      backgroundSize:{
        "500%": "500%"
      },
      keyframes: {
        bg_travel_x: {
          '0%' : { backgroundPosition: "0 0" },
          '100%': { backgroundPosition: "100% 100%" },
        },
        color_morph: {
          '0%' : { color: "theme(colors.primary.500)" },
          '100%': { color: "theme(colors.secondary.500)" },
        },
      },
      animation:{
        "bg-travel-y": "bg_travel_x 10s ease-in-out infinite alternate",
        "color_morph": "color_morph 10s ease-in-out infinite alternate"
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
  plugins: [require("tailwindcss-radix")()],
} satisfies Config;
