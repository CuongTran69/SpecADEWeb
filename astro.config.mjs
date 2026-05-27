import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  site: 'https://cuongtran69.github.io',
  base: '/SpecADEWeb',
  integrations: [vue()],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'vi'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
})
