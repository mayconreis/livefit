<template>
  <AppBodyContainer>
    <v-row>
      <v-col>
        <span v-if='!myPatients.length' class='text-h5'>Nenhum paciente encontrado</span>
        <v-card v-else elevation='0' v-for='patient in myPatients' :key='patient.id'>
          <v-container>
            <v-row>
              <v-col>
                <v-card-title>{{ patient.fullName }}</v-card-title>
              </v-col>
              <v-col>
                <v-card-text>{{ patient.email }}</v-card-text>
              </v-col>
              <v-col>
                <v-card-actions class='justify-end'>
                  <v-btn
                    color='primary'
                    icon
                    @click.stop.prevent='$nuxt.$emit("toggleRoutineDialog", {patientId: patient.id})'
                  >
                    <v-icon>
                      mdi-plus
                    </v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    color='secondary'
                    @click.stop.prevent='$nuxt.$emit("toggleRoutineEditDialog", {patientId: patient.id})'
                  >
                    <v-icon>
                      mdi-square-edit-outline
                    </v-icon>
                  </v-btn>
                  <v-btn color='accent' icon @click.stop.prevent='handleDeleteRoutine(patient.id)'>
                    <v-icon>
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <AppRoutineForm />
    <AppRoutineEditForm />
  </AppBodyContainer>
</template>
<script lang='ts'>
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { TUserResponse } from '~/store/user';
import { defaultMessages, TSnackbarPayload } from '~/store/snackbar';
import { AxiosError } from 'axios';

export default Vue.extend({
  head() {
    return {
      title: 'Meus pacientes'
    };
  },

  data() {
    return {
      myPatients: [] as TUserResponse[]
    };
  },

  computed: {
    ...mapGetters({
      patients: 'user/patients',
      routine: 'routine/routine'
    })
  },

  methods: {
    ...mapActions({
      getUsers: 'user/getUsers',
      deleteRoutine: 'routine/deleteRoutine',
      getRoutine: 'routine/getRoutineByPatient'
    }),

    getMyPatients() {
      this.myPatients = this.patients.filter((patient: TUserResponse) => patient.nutritionistId === this.$auth.user?.id);
    },

    async showSnackbar({ message, type }: TSnackbarPayload) {
      await this.$notifier.showMessage({ message, type });
    },

    async handleDeleteRoutine(patientId: number) {
      try {
        this.$nuxt.$loading.start();
        await this.getRoutine({ id: patientId, nutritionistId: this.$auth.user?.id });
        await this.deleteRoutine(this.routine?.id);
        await this.showSnackbar({ ...defaultMessages.successDelete });
      } catch (err) {
        const message = (err as AxiosError).response?.data.message || defaultMessages.errorDelete;
        await this.showSnackbar({ message, type: 'error' });
      } finally {
        this.$nuxt.$loading.finish();
      }
    }
  },

  created() {
    this.$nuxt.$nextTick(async () => {
      try {
        this.$nuxt.$loading.start();

        await this.getUsers();
        this.getMyPatients();
      } finally {
        this.$nuxt.$loading.finish();
      }
    });
  }
});
</script>