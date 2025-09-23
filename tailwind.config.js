/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // GitHub-inspired color palette
        github: {
          light: {
            bg: '#ffffff',
            'bg-secondary': '#f6f8fa',
            'bg-tertiary': '#f1f3f4',
            text: '#24292f',
            'text-secondary': '#656d76',
            border: '#d0d7de',
            accent: '#0969da',
            success: '#1a7f37',
            danger: '#cf222e',
            warning: '#bf8700',
          },
          dark: {
            bg: '#0d1117',
            'bg-secondary': '#161b22',
            'bg-tertiary': '#21262d',
            text: '#f0f6fc',
            'text-secondary': '#8b949e',
            border: '#30363d',
            accent: '#58a6ff',
            success: '#3fb950',
            danger: '#f85149',
            warning: '#d29922',
          }
        }
      },
      fontFamily: {
        'github': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}