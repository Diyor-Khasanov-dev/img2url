// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'img2url - Deploy Your Images to the Web in Seconds',
      meta: [
        { name: 'description', content: 'Instant image hosting and high-speed global CDN deployment. Convert local images into fast production URLs.' },
        { name: 'theme-color', content: '#09090b' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})
