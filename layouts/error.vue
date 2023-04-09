<template>
  <v-main>
    <v-container fill-height>
      <v-row>
        <v-col cols='12' md='6' class='d-flex justify-center justify-md-end'>
          <v-img :src='pizzaBlock' max-width='300'></v-img>
        </v-col>
        <v-col cols='12' md='6'>
          <v-card elevation='0' class='text-center text-md-start' color='transparent'>
            <v-card-title class='text-uppercase text-h1 justify-center justify-md-start'>Oops!</v-card-title>
            <v-card-text class='text-h6'>Erro {{ error.statusCode }}: {{ message }}</v-card-text>
            <v-card-actions>
              <v-btn to='/' rounded color='secondary'>Voltar ao inicio</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang='ts'>
import Vue, { PropType } from 'vue';
import { NuxtError } from '@nuxt/types';
import pizzaBlock from '~/assets/images/pizza-block.png';

export default Vue.extend({
  layout: 'simple',
  auth: false,
  props: {
    error: {
      type: Object as PropType<NuxtError>,
      required: true
    }
  },

  data() {
    return {
      message: this.error.statusCode === 404
        ? 'A página solicitada não está disponível.'
        : 'Ocorreu um erro inesperado, por favor tente novamente em instantes.',
      pizzaBlock
    };
  },

  head() {
    return {
      title: `${ this.error.statusCode }`
    };
  }
});
</script>