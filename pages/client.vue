<template>
  <v-main>
    <AppBodyContainer>
      <AppTabs :navigation='tabsNavigation'></AppTabs>
    </AppBodyContainer>
    <nuxt-child key='client'></nuxt-child>
  </v-main>
</template>

<script lang='ts'>
import Vue from 'vue';
import { EUserProfile } from '~/store/user';

export default Vue.extend({
  auth: true,

  data() {
    return {
      tabsNavigation: [
        {
          name: 'Rotina de alimentação',
          description: 'Acompanhar minhas rotinas de alimentação',
          path: '/client/routine',
          show: this.$auth.user?.profile === EUserProfile.PATIENT
        },
        {
          name: 'Meus pacientes',
          description: 'Cadastrar rotinas de alimentação para os pacientes',
          path: '/client/mypatients',
          show: this.$auth.user?.profile === EUserProfile.NUTRITIONIST
        },
        {
          name: 'Perfil',
          description: 'Visualizar meu perfil',
          path: '/client/profile',
          show: true
        },
      ]
    };
  }
});
</script>