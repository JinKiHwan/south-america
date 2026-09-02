// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'ko', name: '한국어', file: 'ko.json' },
      { code: 'es', name: 'Español', file: 'es.json' },
      { code: 'pt', name: 'Português', file: 'pt.json' },
    ],
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'ko',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },
  css: ['~/assets/css/tailwind.css'],
  build: {
    transpile: ['gsap'],
  },
  nitro: {
    // sanitize-html is CommonJS while its parser dependency is ESM. Vercel's
    // Node runtime cannot bridge that pair when both packages are external,
    // so bundle the sanitizer with the server output.
    externals: {
      inline: ['sanitize-html'],
    },
    vercel: {
      functions: { maxDuration: 300 },
    },
  },
});
