<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col>
          <span class='text-h3'>Você está logado!</span>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
  auth: true
});
</script>