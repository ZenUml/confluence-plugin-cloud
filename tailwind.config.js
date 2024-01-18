module.exports = {
  content: ["./public/**/*.html", "./src/**/*.vue", "./src/**/*.tsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {}
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })]
};
