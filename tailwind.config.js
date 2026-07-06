/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-deep': 'var(--bg-deep)',
        'surface-1': 'var(--surface-1)',
        'surface-2': 'var(--surface-2)',
        border: 'var(--border)',
        hair: 'var(--hairline)',
        txt: 'var(--text)',
        'txt-sub': 'var(--text-sub)',
        'txt-muted': 'var(--text-muted)',
        accent: 'var(--accent)',
        'accent-deep': 'var(--accent-deep)',
        gold: 'var(--gold)',
        'gold-deep': 'var(--gold-deep)',
        win: 'var(--win)',
        danger: 'var(--danger)',
        'danger-strong': 'var(--danger-strong)',
        info: 'var(--info)',
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      maxWidth: {
        mobile: '390px',
      },
    },
  },
  plugins: [],
}
