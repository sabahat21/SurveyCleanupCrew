/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary colour values from index.css
        primary: "var(--primary)",
        "primary-dark": "var(--primary-dark)",
        "primary-light": "var(--primary-light)",
        "primary-lighter": "var(--primary-lighter)",

        // Secondary colour values (The Saffron/Gold Colors section in index.css)
        secondary: "var(--secondary)",
        "secondary-dark": "var(--secondary-dark)",
        accent: "var(--accent)",
        success: "var(--success)",
        warning: "var(--warning)",

        // Background colors
        "bg-primary": "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        "bg-card": "var(--bg-card)",
        "bg-card-hover": "var(--bg-card-hover)",
        "bg-input": "var(--bg-input)",
        "bg-input-focus": "var(--bg-input-focus)",
      },
    },
    extend: {
      fontFamily: {
        samarkan: ['"Samarkan Normal V2"', 'cursive'],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        devanagari: [
          "Noto Sans Devanagari",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
