<template>
  <v-container>
    <v-app-bar fixed color='white' light app height='100'>
      <v-app-bar-nav-icon v-if='isMobile' />
      <AppLogo :width='150' :is-white-variant='false' />
      <v-spacer />
      <v-text-field outlined rounded dense clearable hide-details prepend-inner-icon='mdi-magnify'
                    placeholder='Buscar'></v-text-field>
      <v-spacer />
      <v-btn text color='primary' @click.stop.prevent='$nuxt.$emit("toggleLoginDialog")' v-if='!isLogged'>
        Login
      </v-btn>
      <v-btn color='primary' @click.stop.prevent='$nuxt.$emit("toggleRegisterDialog")' v-if='!isLogged'>
        Cadastrar-se
      </v-btn>
      <AppProfileMenu v-if='isLogged' />
    </v-app-bar>
    <AppLoginForm />

  </v-container>
</template>

<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
  name: 'AppNavbar',

  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile;
    },

    isLogged() {
      return this.$auth.loggedIn
    }
  }
});
</script>