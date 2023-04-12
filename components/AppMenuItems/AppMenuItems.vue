<template>
  <v-list>
    <v-list-item v-for='item in navigation' :key='item.title' :to='item.href'>
      <v-list-item-icon>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-icon>
      <v-list-item-title>
        {{ item.title }}
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script lang='ts'>
import Vue, { PropType } from 'vue';
import { TMenuItems } from '~/components/AppMenuItems/TMenuItems';

export default Vue.extend({
  props: {
    navigation: {
      type: Array as PropType<TMenuItems>,
      required: true
    }
  },
});
</script>