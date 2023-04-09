<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>Você está sendo deslogado, por gentileza aguarde alguns instantes...</v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang='ts'>
import Vue from 'vue';
import { defaultMessages, TSnackbarPayload } from '~/store/snackbar';

export default Vue.extend({
  head() {
    return {
      title: 'Logout'
    };
  },

  created() {
    this.$nuxt.$nextTick(async () => {
      try {
        await this.handleLogout();
        await this.showSnackbar({ ...defaultMessages.successLoggedOut });
      } catch (err) {
        await this.showSnackbar({ ...defaultMessages.errorLoggedOut });
      } finally {
        setTimeout(async () => await this.$nuxt.$router.push('/'), 2000);
      }
    });
  },

  methods: {
    async showSnackbar({ message, type }: TSnackbarPayload) {
      await this.$notifier.showMessage({ message, type });
    },

    async handleLogout() {
      await this.$auth.logout();
    }
  }
});
</script>