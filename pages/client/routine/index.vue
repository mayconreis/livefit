<template>
  <AppBodyContainer>
    <v-row>
      <v-col>
        <span class='font-weight-bold text-h4'>Minhas rotinas</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-timeline v-if='routine'>
          <v-timeline-item
            v-for='(meal, i) in routine.meals'
            :key='meal.id'
            fill-dot
            :right='i / 2 === 0'
            :color='mappedPeriodColors[meal.period]'
          >
            <v-card>
              <v-card-title>{{ mappedPeriod[meal.period] }} - {{ meal.time }}</v-card-title>
              <v-container>
                <v-row>
                  <v-col>
                    <v-list>
                      <v-list-item>
                        <v-list-item-content v-for='option in meal.options' :key='option.id'>
                          <v-list-item-title class='text-h6'>Option</v-list-item-title>
                          <v-list-item-subtitle v-for='item in option.items' :key='item.id'>{{ item.item }} -
                            {{ item.quantity }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-timeline-item>
        </v-timeline>
        <span v-else class='text-body-2'>Você não possui rotinas de alimentação.</span>
      </v-col>
    </v-row>
  </AppBodyContainer>
</template>

<script lang='ts'>
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { EMealsPeriod } from '~/store/routine';
import { defaultMessages, TSnackbarPayload } from '~/store/snackbar';
import { AxiosError } from 'axios';

export default Vue.extend({
  head() {
    return {
      title: 'Rotinas de alimentação'
    };
  },

  data() {
    const mappedPeriod = {
      [EMealsPeriod.MORNING]: 'Manhã',
      [EMealsPeriod.AFTERNOON]: 'Tarde',
      [EMealsPeriod.EVENING]: 'Noite'
    };

    const mappedPeriodColors = {
      [EMealsPeriod.MORNING]: 'orange',
      [EMealsPeriod.AFTERNOON]: 'yellow',
      [EMealsPeriod.EVENING]: 'blue'
    };

    return {
      mappedPeriod,
      mappedPeriodColors
    };
  },

  computed: {
    ...mapGetters({
      routine: 'routine/routine'
    })
  },

  methods: {
    ...mapActions({
      getRoutineByPatient: 'routine/getRoutineByPatient',
      setRoutine: 'routine/setRoutine'
    }),

    async showSnackbar({ message, type }: TSnackbarPayload) {
      await this.$notifier.showMessage({ message, type });
    }

  },

  created() {
    this.$nuxt.$nextTick(async () => {
      try {
        this.$nuxt.$loading.start();
        await this.setRoutine({});
        await this.getRoutineByPatient({ id: this.$auth.user.id, nutritionistId: this.$auth.user.nutritionistId });
      } catch (err) {
        let message = (err as AxiosError).response?.data.message || defaultMessages.errorData.message;

        await this.showSnackbar({ message, type: 'error' });
      } finally {
        this.$nuxt.$loading.finish();
      }

    });
  }
});
</script>