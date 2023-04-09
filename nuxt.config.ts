import { NuxtConfig } from '@nuxt/types';
import pt from 'vuetify/src/locale/pt';
import * as process from 'process';

export default <NuxtConfig> {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: `%s - ${ process.env.APP_TITLE }`,
    title: process.env.APP_TITLE,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Livefit é uma plataforma para conectar paciêntes à nutricionistas'
      },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: true },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap'
      }
    ]
  },

  loading: '~/components/AppLoader',

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [ '~/assets/css/main.css' ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [ '~/plugins/notifier' ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.APP_API
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: [ '~/assets/scss/variables.scss' ],
    font: {
      family: '"Open Sans", sans-serif'
    },
    treeShake: true,
    lang: {
      locales: { pt },
      current: 'pt'
    },
    theme: {
      dark: false,
      icons: {
        iconfont: 'mdi'
      },
      themes: {
        light: {
          primary: '#275950',
          accent: '#BF382C',
          secondary: '#1C4039',
          info: '#202020',
          warning: '#F1C544',
          error: '#FF4D4D',
          success: '#43B581'
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  router: {
    middleware: [ 'auth' ]
  },

  auth: {
    redirect: {
      login: '/',
      logout: '/logout',
      home: '/'
    },
    strategies: {
      local: {
        token: {
          property: 'token',
          global: true,
          required: true,
          type: 'Bearer'
        },
        user: {
          property: false
        },
        endpoints: {
          login: { url: '/auth/login', method: 'POST' },
          logout: { url: '/auth/logout', method: 'POST' },
          user: { url: '/users/profile', method: 'GET' }
        }
      }
    }
  }
};
