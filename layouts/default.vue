<template>
  <v-app>
    <AppNavbar />
    <AppSnackbar />
    <Nuxt />
  </v-app>
</template>

<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
  auth: true
});
</script>