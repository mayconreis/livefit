<template>
  <v-row justify='center'>
    <v-dialog v-model='show'>
      <v-card>
        <v-app-bar>
          <v-card-title>Cadastro Rotinas de Alimentação</v-card-title>
          <v-spacer />
          <v-btn icon @click.stop.prevent='show = false'>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>
        <v-card-text>
          <v-form ref='registerRoutineFormRef' v-model='registerRoutineFormValid'>
            <v-container>
              <v-row>
                <v-col v-for='meal of registerRoutineForm.meals' :key='meal.period'>
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
                    <v-row v-for='(items, i) of meal.mealOptions' :key='i'>
                      <v-col>
                        <v-row>
                          <p class='text-h6'>Itens</p>
                        </v-row>
                        <v-row v-for='(item, i) of items.items' :key='i'>
                          <v-col>
                            <v-text-field
                              v-model='item.item'
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
                              v-model='item.quantity'
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
          <v-btn color='primary' @click.stop.prevent='handleRegisterRoutine'>Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang='ts'>
import Vue from 'vue';
import validateMixin from '~/mixins/validateMixin';
import { defaultMessages, TSnackbarPayload } from '~/store/snackbar';
import { EMealsPeriod } from '~/store/routine';
import { mapActions } from 'vuex';
import { AxiosError } from 'axios';

type TRegisterRoutineForm = {
  patientId: number,
  meals: {
    period: string,
    time: string,
    mealOptions: {
      items: {
        item: string,
        quantity: string
      }[]
    }[]
  }[]
}

export default Vue.extend({
  mixins: [ validateMixin ],
  name: 'AppRoutineForm',

  data() {

    const routineFormDefaultValues: TRegisterRoutineForm = {
      patientId: 0,
      meals: [
        {
          period: EMealsPeriod.MORNING,
          time: '',
          mealOptions: [
            {
              items: [
                {
                  item: '',
                  quantity: ''
                },
                {
                  item: '',
                  quantity: ''
                },
                {
                  item: '',
                  quantity: ''
                }
              ]
            }
          ]
        },
        {
          period: EMealsPeriod.AFTERNOON,
          time: '',
          mealOptions: [
            {
              items: [
                {
                  item: '',
                  quantity: ''
                },
                {
                  item: '',
                  quantity: ''
                },
                {
                  item: '',
                  quantity: ''
                }
              ]
            }
          ]
        },
        {
          period: EMealsPeriod.EVENING,
          time: '',
          mealOptions: [
            {
              items: [
                {
                  item: '',
                  quantity: ''
                },
                {
                  item: '',
                  quantity: ''
                },
                {
                  item: '',
                  quantity: ''
                }
              ]
            }
          ]
        }
      ]
    };
    return {
      show: false,
      patientId: 0,
      registerRoutineFormValid: null,
      registerRoutineForm: {} as TRegisterRoutineForm,
      routineFormDefaultValues
    };
  },

  methods: {
    ...mapActions({
      getUser: 'user/getUser',
      createRoutine: 'routine/createRoutine'
    }),
    async showSnackbar({ message, type }: TSnackbarPayload) {
      await this.$notifier.showMessage({ message, type });
    },

    async handleRegisterRoutine() {
      (this.$refs.registerRoutineFormRef as VForm)?.validate();
      if (this.registerRoutineFormValid) {
        try {
          this.$nuxt.$loading.start();

          await this.createRoutine({ ...this.registerRoutineForm });

          await this.showSnackbar({ ...defaultMessages.successStore });

          this.show = false;
        } catch (err) {
          const message = (err as AxiosError).response?.data.message || defaultMessages.errorStore.message;
          await this.showSnackbar({ message, type: 'error' });
        } finally {
          this.$nuxt.$loading.finish();
        }
      }
    }

  },

  created() {
    this.$nuxt.$nextTick(async () => {
      this.$nuxt.$on('toggleRoutineDialog', async (args: { patientId: number }) => {
        try {
          this.$nuxt.$loading.start();

          await this.getUser(args.patientId);
          this.registerRoutineForm = {
            ...this.routineFormDefaultValues
          };
          this.registerRoutineForm.patientId = args.patientId;
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