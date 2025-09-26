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
        "secondary-light": "var(--secondary-light)",
        accent: "var(--accent)",
        success: "var(--success)",
        warning: "var(--warning)",

        // Survey Layout colours
        "survey-bg": "var(--survey-bg)",

        // Header colors
        "header-bg": "var(--header-bg)",
        "header-primary": "var(--header-primary)",
        "header-subtitle": "var(--header-subtitle)",
        "header-accent": "var(--header-accent)",

        // Header button colours
        "btn-active-text": "var(--btn-active-text)",
        "btn-inactive-text": "var(--btn-inactive-text)",
        "btn-inactive-hover-bg": "var(--btn-inactive-hover-bg)",
        "btn-inactive-hover-border": "var(--btn-inactive-hover-border)",

        "btn-analytics-bg": "var(--btn-analytics-bg)",
        "btn-analytics-text": "var(--btn-analytics-text)",
        "btn-analytics-hover-bg": "var(--btn-analytics-hover-bg)",
        "btn-analytics-hover-border": "var(--btn-analytics-hover-border)",

        "btn-ranking-bg": "var(--btn-ranking-bg)",
        "btn-ranking-text": "var(--btn-ranking-text)",
        "btn-ranking-hover-bg": "var(--btn-ranking-hover-bg)",
        "btn-ranking-hover-border": "var(--btn-ranking-hover-border)",

        "btn-preview-bg": "var(--btn-preview-bg)",
        "btn-preview-text": "var(--btn-preview-text)",
        "btn-preview-hover-bg": "var(--btn-preview-hover-bg)",
        "btn-preview-hover-border": "var(--btn-preview-hover-border)",

        "btn-save-questions-bg": "var(--btn-save-questions-bg)",
        "btn-save-questions-text": "var(--btn-save-questions-text)",
        "btn-save-questions-hover-bg": "var(--btn-save-questions-hover-bg)",
        "btn-save-questions-hover-border":
          "var(--btn-save-questions-hover-border)",

        "btn-save-changes-bg": "var(--btn-save-changes-bg)",
        "btn-save-changes-text": "var(--btn-save-changes-text)",
        "btn-save-changes-hover-bg": "var(--btn-save-changes-hover-bg)",

        "btn-logout-bg": "var(--btn-logout-bg)",
        "btn-logout-text": "var(--btn-logout-text)",
        "btn-logout-hover-bg": "var(--btn-logout-hover-bg)",
        "btn-logout-hover-border": "var(--btn-logout-hover-border)",

        // Question card colours
        "question-card-bg": "var(--question-card-bg)",
        "question-text": "var(--question-text)",

        // Sidebar colours
        "sidebar-bg": "var(--sidebar-bg)",
        "sidebar-text": "var(--sidebar-text)",
        "active-level-tab-bg": "var(--active-level-tab-bg)",
        "active-level-tab-text": "var(--active-level-tab-text)",
        "inactive-level-tab-bg": "var(--inactive-level-tab-bg)",
        "inactive-level-tab-text": "var(--inactive-level-tab-text)",
        "progress-text": "var(--progress-text)",
        "progress-number": "var(--progress-number)",
        "progress-bar-from": "var(--progress-bar-from)",
        "progress-bar-to": "var(--progress-bar-to)",
        "levelquestion-active-bg": "var(--levelquestion-active-bg)",
        "levelquestion-active-border": "var(--levelquestion-active-border)",

        // Login colours
        "login-bg": "var(--login-bg)",
        "login-card-bg": "var(--login-card-bg)",
        "login-active-text": "var(--login-active-text)",
        "login-nonactive-text": "var(--login-nonactive-text)",
        "login-nonactive-bg": "var(--login-nonactive-bg)",
        "login-primary": "var(--login-primary)",
        "login-input-border": "var(--login-input-border)",
        "login-checkbox-border": "var(--login-checkbox-border)",
        "login-focus-border": "var(--login-focus-border)",
        "login-checkbox-text": "var(--login-checkbox-text)",
        "login-button-bg": "var(--login-button-bg)",
        "login-button-text": "var(--login-button-text)",
        "login-button-hover": "var(--login-button-hover)",
        "login-error-text": "var(--login-error-text)",
        "login-error-bg": "var(--login-error-bg)",
        "login-error-border": "var(--login-error-border)",
        "login-welcome-text": "var(--login-welcome-text)",

        // Proficiency modal colours
        "proficiency-bg": "var(--proficiency-bg)",
        "proficiency-card-bg": "var(--proficiency-card-bg)",
        "proficiency-primary": "var(--proficiency-primary)",
        "proficiency-active-text": "var(--proficiency-active-text)",
        "proficiency-level-text": "var(--proficiency-level-text)",
        "proficiency-hover": "var(--proficiency-hover)",
        "proficiency-confirm-bg": "var(--proficiency-confirm-bg)",
        "proficiency-confirm-text": "var(--proficiency-confirm-text)",

        // Not Found page colours
        "notfound-bg": "var(--notfound-bg)",
        "notfound-primary": "var(--notfound-primary)",
        "notfound-hover": "var(--notfound-hover)",
        "notfound-text": "var(--notfound-text)",
        "notfound-button-text": "var(--notfound-button-text)",

        // Logout Prompt colours
        "logout-bg": "#1a202c84",
        "logout-card-bg": "var(--logout-card-bg)",
        "logout-primary": "var(--logout-primary)",
        "logout-hover": "var(--logout-hover)",
        "logout-text": "var(--logout-text)",
        "logout-button-text": "var(--logout-button-text)",
        "logout-cancel-text": "var(--logout-cancel-text)",
        "logout-cancel-bg": "var(--logout-cancel-bg)",
        "logout-cancel-hover": "var(--logout-cancel-hover)",

        //Update Survey colors
        "update-bg": "#1a202c83",
        "update-card-bg": "var(--update-card-bg)",
        "update-primary": "var(--update-primary)",
        "update-text": "var(--update-text)",
        "update-button-bg": "var(--update-button-bg)",
        "update-button-hover": "var(--update-button-hover)",
        "update-button-text": "var(--update-button-text)",
        "update-cancel-bg": "var(--update-cancel-bg)",
        "update-cancel-hover": "var(--update-cancel-hover)",

        // Admin database connection lost
        "adminlost-bg": "var(--adminlost-bg)",
        "adminlost-connection-issue": "var(--adminlost-connection-issue)",
        "adminlost-card-bg": "var(--adminlost-card-bg)",
        "adminlost-icon": "var(--adminlost-icon)",
        "adminlost-icon-bg": "var(--adminlost-icon-bg)",
      },

      fontFamily: {
        samarkan: ['"Samarkan Normal V2"', "cursive"],
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
