
import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dental-blue': '#3b82f6',
        'dental-blue-dark': '#2563eb',
        'dental-light-blue': '#dbeafe',
      },
    },
  },
  plugins: [],
} satisfies Config;
