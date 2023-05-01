<template>
  <v-tabs v-model='tab'>
    <v-tab
      v-for='item in navigation'
      :key='item.name'
      :to='item.path'
      exact-path
      nuxt
      v-if='item.show'
    >
      {{ item.name }}
    </v-tab>
  </v-tabs>
</template>

<script lang='ts'>
import Vue, { PropType } from 'vue';

type TNavigation = {
  name: string;
  description: string;
  path: string;
  show: boolean;
}

export default Vue.extend({
  name: 'AppTabs',

  props: {
    navigation: {
      type: Array as PropType<TNavigation[]>,
      required: true
    }
  },

  data() {
    return {
      tab: null
    }
  }
});
</script>