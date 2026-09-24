/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    { pattern: /^print:/ }, // keep ALL print: variants
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

