/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mint Green Palette
        'mint': {
          50: '#F3FDFB',
          100: '#E9FBF6',
          400: '#4DCAA1',
          500: '#3EB489',
          600: '#3EB489',
          700: '#359A77',
          800: '#2D7F63',
          900: '#25654F',
        },
        // Additional Colors
        'blue': '#365EBF',
        'success': '#02cb97',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'ink': '#111827',
        'body': '#374151',
        'muted': '#6B7280',
        'surface': '#FFFFFF',
        'surface-subtle': '#F8FAFC',
        'line': '#E5E7EB',
      },
      fontFamily: {
        'heading': ['Poppins', 'system-ui', 'sans-serif'],
        'body': ['Figtree', 'system-ui', 'sans-serif'],
        'sans': ['Figtree', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float-slow 20s ease-in-out infinite',
        'float-reverse': 'float-reverse 25s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -30px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(-30px, 30px) scale(1.1)' },
          '66%': { transform: 'translate(20px, -20px) scale(0.9)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'fadeIn': {
          'from': { 
            opacity: '0',
            transform: 'translateY(20px)',
          },
          'to': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slideUp': {
          'from': { 
            opacity: '0',
            transform: 'translateY(40px)',
          },
          'to': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      boxShadow: {
        'mint': '0 4px 16px rgba(2, 203, 151, 0.25), 0 2px 8px rgba(2, 203, 151, 0.15)',
        'mint-lg': '0 6px 20px rgba(2, 203, 151, 0.3), 0 4px 12px rgba(2, 203, 151, 0.2)',
        'glass': '0 8px 32px rgba(17, 24, 39, 0.12)',
        'glass-lg': '0 20px 60px rgba(17, 24, 39, 0.15)',
      },
      borderRadius: {
        'card': '20px',
        'button': '16px',
      },
    },
  },
  plugins: [],
}
