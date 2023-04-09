<template>
  <v-snackbar
    v-model='show'
    :color='color'
    :timeout='timeout'
    left
    dark
    elevation='2'
    class='ml-16 mb-10'
  >
    {{ message }}
    <template #action='{ attrs }'>
      <v-btn icon v-bind='attrs' @click='show = false'>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
  data() {
    const MESSAGE_TIMEOUT = 3000;

    return {
      show: false,
      message: '',
      color: '',
      timeout: MESSAGE_TIMEOUT
    };
  },

  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'snackbar/SHOW_MESSAGE') {
        this.message = state.snackbar.message;
        this.color = state.snackbar.color;
        this.show = true;
      }
    });
  }
});
</script>