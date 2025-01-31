module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',  // Added src to the content
  ],
  darkMode: 'class', // This enables dark mode based on the presence of the 'dark' class
  theme: {
    extend: {
      // Customize your theme here if needed
    },
  },
  plugins: [],
}
