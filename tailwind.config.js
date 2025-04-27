/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',  // Use this path for 'app' directory
    './src/pages/**/*.{js,ts,jsx,tsx}',  // If you ever use the 'pages' directory
    './src/components/**/*.{js,ts,jsx,tsx}', // If you have a components folder
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // This makes Sarabun the default sans-serif font
      },
      colors: {
        analyzeOrange: '#FF9900',
        analyzePurple: '#7F1AFF',
      },
    },
  },
  plugins: [],
};
