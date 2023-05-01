<template>
  <AppBodyContainer>
    <v-row>
      <v-col>
        <v-card elevation='0' v-for='patient in patients' :key='patient.id'>
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
                  <v-btn color='primary'
                         @click.stop.prevent='$nuxt.$emit("toggleRoutineDialog", {patientId: patient.id})'>Cadastrar
                    rotina
                  </v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <AppRoutineForm />
  </AppBodyContainer>
</template>
<script lang='ts'>
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

export default Vue.extend({
  head() {
    return {
      title: 'Meus pacientes'
    };
  },

  computed: {
    ...mapGetters({
      patients: 'user/patients'
    })
  },

  methods: {
    ...mapActions({
      getUsers: 'user/getUsers'
    })
  },

  created() {
    this.$nuxt.$nextTick(async () => {
      try {
        this.$nuxt.$loading.start();

        await this.getUsers();
      } finally {
        this.$nuxt.$loading.finish();
      }
    });
  }
});
</script>