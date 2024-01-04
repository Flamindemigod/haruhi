import { Config } from "tailwindcss";

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
    "bg-pink-500",
    "bg-rose-400",
  ],
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      aspectRatio: {
        cover: "2/3",
      },
      gridTemplateColumns: {
        mNavContainer:
          "1fr 1fr [search-start] theme(width.16) [search-end] 1fr 1fr",
      },
      backgroundSize: {
        "500%": "500%",
      },
      keyframes: {
        spin: {
          "0%": { rotate: "0" },
          "100%": { rotate: "1turn" },
        },
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
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-left": {
          "0%": { opacity: "0", transform: "translateX(10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-right": {
          "0%": { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-out-down": {
          "0%": { opacity: "1", transform: "translateY(-10px)" },
          "100%": { opacity: "0", transform: "translateY(0)" },
        },
        "slide-out-up": {
          "0%": { opacity: "1", transform: "translateY(10px)" },
          "100%": { opacity: "0", transform: "translateY(0)" },
        },
        "slide-out-left": {
          "0%": { opacity: "1", transform: "translateX(10px)" },
          "100%": { opacity: "0", transform: "translateX(0)" },
        },
        "slide-out-right": {
          "0%": { opacity: "1", transform: "translateX(-10px)" },
          "100%": { opacity: "0", transform: "translateX(0)" },
        },
        // Tooltip
        "slide-up-fade": {
          "0%": { opacity: "0", transform: "translateY(2px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-right-fade": {
          "0%": { opacity: "0", transform: "translateX(-2px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-down-fade": {
          "0%": { opacity: "0", transform: "translateY(-2px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-left-fade": {
          "0%": { opacity: "0", transform: "translateX(2px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        // Navigation menu
        "enter-from-right": {
          "0%": { transform: "translateX(200px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "enter-from-left": {
          "0%": { transform: "translateX(-200px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "exit-to-right": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(200px)", opacity: "0" },
        },
        "exit-to-left": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(-200px)", opacity: "0" },
        },
        "scale-in-content": {
          "0%": { transform: "rotateX(-30deg) scale(0.9)", opacity: "0" },
          "100%": { transform: "rotateX(0deg) scale(1)", opacity: "1" },
        },
        "scale-out-content": {
          "0%": { transform: "rotateX(0deg) scale(1)", opacity: "1" },
          "100%": { transform: "rotateX(-10deg) scale(0.95)", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        // Toast
        "toast-hide": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "toast-slide-in-right": {
          "0%": { transform: `translateX(calc(100% + 1rem))` },
          "100%": { transform: "translateX(0)" },
        },
        "toast-slide-in-bottom": {
          "0%": { transform: `translateY(calc(100% + 1rem))` },
          "100%": { transform: "translateY(0)" },
        },
        "toast-swipe-out-x": {
          "0%": { transform: "translateX(var(--radix-toast-swipe-end-x))" },
          "100%": {
            transform: `translateX(calc(100% + 1rem))`,
          },
        },
        "toast-swipe-out-y": {
          "0%": { transform: "translateY(var(--radix-toast-swipe-end-y))" },
          "100%": {
            transform: `translateY(calc(100% + 1rem))`,
          },
        },
      },
      animation: {
        "banner-move-s": "bannerMove 30s alternate infinite linear",
        "banner-move-f": "bannerMove 20s alternate infinite linear",
        "bg-travel-y": "bg_travel_x 10s ease-in-out infinite alternate",
        color_morph: "color_morph 10s ease-in-out infinite alternate",
        // Dropdown menu
        "scale-in": "scale-in 0.2s ease-in-out",
        "slide-down": "slide-down 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-left": "slide-left 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-right": "slide-right 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-out-down": "slide-out-down 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-out-up": "slide-out-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-out-left": "slide-out-left 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-out-right": "slide-out-right 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        // Tooltip
        "slide-up-fade": "slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-right-fade":
          "slide-right-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down-fade": "slide-down-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-left-fade": "slide-left-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        // Navigation menu
        "enter-from-right": "enter-from-right 0.25s ease",
        "enter-from-left": "enter-from-left 0.25s ease",
        "exit-to-right": "exit-to-right 0.25s ease",
        "exit-to-left": "exit-to-left 0.25s ease",
        "scale-in-content": "scale-in-content 0.2s ease",
        "scale-out-content": "scale-out-content 0.2s ease",
        "fade-in": "fade-in 0.2s ease",
        "fade-out": "fade-out 0.2s ease",
        // Toast
        "toast-hide": "toast-hide 100ms ease-in forwards",
        "toast-slide-in-right":
          "toast-slide-in-right 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "toast-slide-in-bottom":
          "toast-slide-in-bottom 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "toast-swipe-out-x": "toast-swipe-out-x 100ms ease-out forwards",
        "toast-swipe-out-y": "toast-swipe-out-y 100ms ease-out forwards",
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
