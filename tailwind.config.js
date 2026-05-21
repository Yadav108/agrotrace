module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#dc2626",
          "red-hover": "#b91c1c",
          "red-muted": "#450a0a",
          "red-border": "#7f1d1d",
          dark: "#080808",
          surface: "#111111",
          elevated: "#1c1c1c",
          border: "#27272a",
          "border-light": "#3f3f46",
        },
      },
    },
  },
  plugins: [],
}
