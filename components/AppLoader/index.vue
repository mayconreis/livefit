<template>
  <v-overlay z-index='9999' v-if='loading'>
    <v-img :src='loader' max-width='240'></v-img>
  </v-overlay>
</template>

<script lang='ts'>
import Vue from 'vue';
import loader from '~/assets/gif/loader.gif';

export default Vue.extend({
  data() {
    return {
      loading: false,
      loader
    };
  },

  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    }
  }
});
</script>