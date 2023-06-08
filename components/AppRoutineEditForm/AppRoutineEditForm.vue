<template>
  <v-row justify='center'>
    <v-dialog v-model='show'>
      <v-card>
        <v-app-bar>
          <v-card-title>Altertar Rotinas de Alimentação</v-card-title>
          <v-spacer />
          <v-btn icon @click.stop.prevent='show = false'>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>
        <v-card-text>
          <v-form ref='registerRoutineFormRef' v-model='alterRoutineFormValid'>
            <v-container>
              <v-row>
                <v-col v-for='meal of alterRoutineForm.meals' :key='meal.period'>
                  <v-container class='px-2'>
                    <v-row>
                      <v-text-field
                        v-model='meal.period'
                        label='Período'
                        disabled
                        placeholder='Período'
                        outlined
                        type='text'
                        prepend-inner-icon='mdi-sun-clock'
                        :rules='rules.required'>
                      </v-text-field>
                    </v-row>
                    <v-row>
                      <v-col cols='4'>
                        <v-text-field
                          v-model='meal.time'
                          label='Horário'
                          placeholder='Horário'
                          outlined
                          type='text'
                          prepend-inner-icon='mdi-clock'
                          :rules='rules.required'>
                        </v-text-field>
                      </v-col>
                      <v-col>
                        <v-time-picker v-model='meal.time' full-width no-title format='24hr'>
                        </v-time-picker>
                      </v-col>
                    </v-row>
                    <v-row v-for='(items, i) of meal.mealItems' :key='i'>
                      <v-col>
                        <v-row>
                          <p class='text-h6'>Itens</p>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-text-field
                              v-model='items.item'
                              label='Item'
                              placeholder='Item'
                              outlined
                              type='text'
                              prepend-inner-icon='mdi-food'
                              :rules='rules.required'>
                            </v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field
                              v-model='items.quantity'
                              label='Quantidade'
                              placeholder='Quantidade'
                              outlined
                              type='text'
                              prepend-inner-icon='mdi-food'
                              :rules='rules.required'>
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color='primary' @click.stop.prevent='handleAlterRoutine'>Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang='ts'>
import Vue from 'vue';
import validateMixin from '~/mixins/validateMixin';
import { defaultMessages, TSnackbarPayload } from '~/store/snackbar';
import { TRoutineResponse } from '~/store/routine';
import { mapActions, mapGetters } from 'vuex';
import { AxiosError } from 'axios';

type TAlterRoutineForm = {
  meals: {
    id: number,
    period: string,
    time: string,
    mealItems: {
      id: number,
      item: string,
      quantity: string
    }[]
  }[]
}

export default Vue.extend({
  mixins: [ validateMixin ],
  name: 'AppRoutineEditForm',

  data() {
    return {
      show: false,
      alterRoutineFormValid: null,
      alterRoutineForm: {} as TAlterRoutineForm
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
      updateRoutine: 'routine/updateRoutine'
    }),
    async showSnackbar({ message, type }: TSnackbarPayload) {
      await this.$notifier.showMessage({ message, type });
    },

    async handleAlterRoutine() {
      (this.$refs.alterRoutineForm as VForm)?.validate();
      if (this.alterRoutineFormValid) {
        try {
          this.$nuxt.$loading.start();

          await this.updateRoutine({ routineId: this.routine.id, payload: this.alterRoutineForm });

          await this.showSnackbar({ ...defaultMessages.successUpdate });

          this.show = false;
        } catch (err) {
          const message = (err as AxiosError).response?.data.message || defaultMessages.errorUpdate.message;
          await this.showSnackbar({ message, type: 'error' });
        } finally {
          this.$nuxt.$loading.finish();
        }
      }
    },

    setFormValues(dataRoutine: TRoutineResponse) {
      this.alterRoutineForm = {
        meals: dataRoutine.meals.map(meal => {
          return {
            id: meal.id,
            period: meal.period,
            time: meal.time,
            mealItems: meal.options[0].items.map(item => {
              return { id: item.id, item: item.item, quantity: item.quantity };
            })
          };
        })
      };
    }
  },

  created() {
    this.$nuxt.$nextTick(async () => {
      this.$nuxt.$on('toggleRoutineEditDialog', async (args: { patientId: number }) => {
        try {
          this.$nuxt.$loading.start();

          await this.getRoutineByPatient({ id: args?.patientId, nutritionistId: this.$auth.user?.id });
          await this.setFormValues(this.routine)

          this.show = true;
        } catch (err) {
          await this.showSnackbar({ ...defaultMessages.errorData });
        } finally {
          this.$nuxt.$loading.finish();
        }
      });
    });

  }
});
</script>