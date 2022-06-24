/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    colors: {
      primary: {
        100: "#e0ccfc",
        200: "#c099f8",
        300: "#a166f5",
        400: "#8133f1",
        500: "#6200ee",
        600: "#4e00be",
        700: "#3b008f",
        800: "#27005f",
        900: "#140030"
      },
      secondary: {
        100: "#cdf8f3",
        200: "#9af0e8",
        300: "#68e9dc",
        400: "#35e1d1",
        500: "#03dac5",
        600: "#02ae9e",
        700: "#028376",
        800: "#01574f",
        900: "#012c27"
      },
    },
    extend: {}
  },
  plugins: []
};