/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-card': 'var(--bg-card)',
        'bg-surface': 'var(--bg-surface)',
        'gold-primary': 'var(--gold-primary)',
        'gold-shine': 'var(--gold-shine)',
        'purple-primary': 'var(--purple-primary)',
        'purple-light': 'var(--purple-light)',
        'green-cta': 'var(--green-cta)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
      },
      fontFamily: {
        oswald: ['Oswald', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      maxWidth: {
        mobile: '390px',
      },
    },
  },
  plugins: [],
}
