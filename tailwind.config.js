/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Iddaa brand colors
        iddaa: {
          50: '#E8F5E8',   // Very light green backgrounds
          100: '#C8E6C8',  // Light green
          200: '#A4D4A4',  // 
          300: '#81C784',  // 
          400: '#66BB6A',  // Accent green for dark mode
          500: '#4CAF50',  // Accent green for light mode
          600: '#00A854',  // Primary green (light mode)
          700: '#008A45',  // Primary green hover (light mode)
          800: '#00C766',  // Primary green (dark mode)
          900: '#1B5E20',  // Dark green
          950: '#0A2F0A',  // Very dark green (dark mode backgrounds)
        },
        // Semantic colors using CSS variables
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        border: 'var(--color-border)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}