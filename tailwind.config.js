/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:          'var(--color-bg)',
        surface:     'var(--color-surface)',
        'surface-alt':'var(--color-surface-alt)',
        gold:        'var(--color-gold)',
        'gold-light':'var(--color-gold-light)',
        'gold-muted':'var(--color-gold-muted)',
        anthracite:  'var(--color-anthracite)',
        charcoal:    'var(--color-charcoal)',
        muted:       'var(--color-muted)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body:    'var(--font-body)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        lg:   'var(--shadow-lg)',
      },
    },
  },
  plugins: [],
}
