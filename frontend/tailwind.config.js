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
      },
    },
  },
  plugins: [],
};
