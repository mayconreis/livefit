<template>
  <AppBodyContainer>
    <v-row>
      <v-col>
        <v-card elevation='0' v-for='solicitation in solicitations' :key='solicitation.id' v-if='!solicitation.finished'>
          <v-container>
            <v-row>
              <v-col>
                <v-card-title>{{ solicitation.user.fullName }}</v-card-title>
              </v-col>
              <v-col>
                <v-card-subtitle>Tipo de solicitação: {{ solicitationType[solicitation.solicitationType] }}
                </v-card-subtitle>
              </v-col>
              <v-col>
                <v-card-actions class='justify-end'>
                  <v-btn color='primary'
                  >Confirmar
                  </v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </AppBodyContainer>
</template>

<script lang='ts'>
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { defaultMessages, TSnackbarPayload } from '~/store/snackbar';
import { ESolicitationTypes } from '~/store/solicitations';

export default Vue.extend({
  head() {
    return {
      title: 'Solicitações'
    };
  },

  data() {
    const solicitationType = {
      [ESolicitationTypes.CONSULT]: 'Consulta',
      [ESolicitationTypes.ROUTINE]: 'Rotina de alimentação'
    };

    return {
      solicitationType
    };
  },

  methods: {
    ...mapActions({
      getSolicitations: 'solicitations/getSolicitations'
    }),

    showSnackbar({ message, type }: TSnackbarPayload) {
      this.$notifier.showMessage({ message, type });
    }
  },

  computed: {
    ...mapGetters({
      solicitations: 'solicitations/solicitations'
    })
  },

  created() {
    this.$nuxt.$nextTick(async () => {
      try {
        this.$nuxt.$loading.start();

        await this.getSolicitations({ filter: { nutritionistId: this.$auth.user?.id }, include: 'user' });
      } catch (err) {
        this.showSnackbar({ ...defaultMessages.errorData });
      } finally {
        this.$nuxt.$loading.finish();
      }
    });
  }
});
</script>