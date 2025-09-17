/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        // Mindful color palette with playful energy
        mindful: {
          // Soothing greens for growth and calm
          sage: {
            50: '#f6f8f6',
            100: '#e9f1e9',
            200: '#d3e3d3',
            300: '#a8c9a8',
            400: '#7ba87b',
            500: '#5a8a5a',
            600: '#477247',
            700: '#3a5d3a',
            800: '#2d4a2d',
            900: '#1f331f',
          },
          // Warm earth tones for grounding
          earth: {
            50: '#faf9f7',
            100: '#f3f1ed',
            200: '#e8e3da',
            300: '#d6ccba',
            400: '#c0ad94',
            500: '#a68d6d',
            600: '#8f7355',
            700: '#776147',
            800: '#5e4d3a',
            900: '#453a2d',
          },
          // Gentle blues for tranquility
          sky: {
            50: '#f5f9fc',
            100: '#e8f3f8',
            200: '#d1e7f1',
            300: '#a6d0e4',
            400: '#7bb4d3',
            500: '#5697c2',
            600: '#4279a3',
            700: '#356184',
            800: '#294c66',
            900: '#1d3848',
          },
          // Playful but gentle accent colors
          coral: {
            50: '#fef7f5',
            100: '#fdede8',
            200: '#f9d5c9',
            300: '#f2b5a0',
            400: '#e88f73',
            500: '#d16a4a',
            600: '#b94d2c',
            700: '#9a3e23',
            800: '#7b321e',
            900: '#5c2617',
          },
          lavender: {
            50: '#f9f8fd',
            100: '#f2f0fa',
            200: '#e3def3',
            300: '#cfc5e8',
            400: '#b5a5db',
            500: '#9684cb',
            600: '#7b68b7',
            700: '#64549a',
            800: '#4f427c',
            900: '#3b315d',
          }
        }
      }
    },
  },
  plugins: [],
}