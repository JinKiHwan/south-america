/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/app.vue",
    "./app/error.vue"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#533afd',
        'primary-deep': '#4434d4',
        'primary-press': '#2e2b8c',
        'primary-soft': '#665efd',
        'primary-subdued': '#b9b9f9',
        'brand-dark': '#1c1e54',
        ruby: '#ea2261',
        magenta: '#f96bee',
        lemon: '#f5a623',
        ink: '#0d253d',
        'ink-secondary': '#273951',
        'ink-mute': '#64748d',
        'ink-mute-2': '#61718a',
        canvas: '#ffffff',
        'canvas-soft': '#f6f9fc',
        'canvas-cream': '#f5e9d4',
        hairline: '#e3e8ee',
        'hairline-input': '#a8c3de',
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        pill: '9999px',
      },
      boxShadow: {
        'level-1': '0 1px 3px rgba(0, 55, 112, 0.08)',
        'level-2': '0 8px 24px rgba(0, 55, 112, 0.08), 0 2px 6px rgba(0, 55, 112, 0.04)',
      },
      letterSpacing: {
        'display-xxl': '-0.0875rem',
        'display-xl': '-0.06rem',
        'display-lg': '-0.04rem',
        'display-md': '-0.01625rem',
        'heading-lg': '-0.01375rem',
        'heading-md': '-0.0125rem',
      },
      maxWidth: {
        'container': '1200px',
      },
    },
  },
  plugins: [],
}
