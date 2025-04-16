// tailwind.config.js
/**
 * @type {import('tailwindcss').Config}
 */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#ff3a3a",
          secondary: "#212121",
          background: "#f8f8f8",
          text: "#333333",
          accent: "#ff6b6b",
        },
      },
    },
    plugins: [],
  }