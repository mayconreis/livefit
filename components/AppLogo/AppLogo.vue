<template>
  <v-img contain :src='isWhiteVariant ? logoWhite : logoGreen' :max-width='width' />
</template>

<script lang='ts'>
import Vue from 'vue';
import logoGreen from '~/assets/images/logo-green.svg';
import logoWhite from '~/assets/images/logo-white.svg';
import salad from '~/assets/images/salad.png';

export default Vue.extend({
  name: 'AppLogo',

  props: {
    width: {
      type: Number,
      default: 200
    },

    isWhiteVariant: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      logoGreen,
      logoWhite,
      salad
    };
  }
});
</script>