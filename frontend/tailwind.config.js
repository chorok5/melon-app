/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}", "./index.html"], // index.html 추가
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}