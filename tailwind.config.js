/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
  safelist: [
    'border-yellow-500',
    'bg-yellow-50',
    'text-yellow-700',
    'hover:border-yellow-300',
    'bg-yellow-100',
    'text-yellow-600',
    'border-red-500',
    'bg-red-50',
    'text-red-700',
    'hover:border-red-300',
    'bg-red-100',
    'text-red-600',
    'border-green-500',
    'bg-green-50',
    'text-green-700',
    'hover:border-green-300',
    'bg-green-100',
    'text-green-600',
    'border-emerald-500',
    'bg-emerald-50',
    'text-emerald-700',
    'hover:border-emerald-300',
    'bg-emerald-100',
    'text-emerald-600',
    'border-blue-500',
    'bg-blue-50',
    'text-blue-700',
    'hover:border-blue-300',
    'bg-blue-100',
    'text-blue-600',
  ]
}