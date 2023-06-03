<template>
  <AppBodyContainer>
    <v-row>
      <v-col>
        <v-card elevation='0'>
          <v-card-text>
            <v-container>
              <v-form ref='registerFormRef' v-model='updateFormValid'>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model='updateForm.fullName'
                      label='Nome completo'
                      placeholder='Nome completo'
                      outlined
                      autofocus
                      counter='150'
                      type='text'
                      prepend-inner-icon='mdi-account'
                      :rules='rules.required'>
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model='updateForm.email'
                      label='Email'
                      placeholder='Email'
                      outlined
                      counter='150'
                      type='text'
                      disabled
                      prepend-inner-icon='mdi-email'
                      :rules='[...rules.required, ...rules.email]'>
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-autocomplete
                      v-model='updateForm.nutritionistId'
                      :value='nutritionists.find(nutritionist => nutritionist.id === updateForm.nutritionistId)'
                      :items='nutritionists'
                      item-text='fullName'
                      item-value='id'
                      outlined
                      label='Nutricionista'
                      v-if='user.profile === EUserProfile.PATIENT'
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-btn color='primary' @click.stop.prevent='handleRequestConsult'>
                      Solicitar consulta presencial
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-radio-group row :rules='[...rules.required]' v-model='updateForm.profile' disabled>
                      <v-radio
                        v-for='profileOption in userProfileOptions'
                        :key='profileOption.id'
                        :label='profileOption.label'
                        :value='profileOption.value'
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-container>
              <v-row>
                <v-col>
                  <v-btn color='primary' :disabled='!updateFormValid' @click.stop.prevent='handleUpdateForm'>
                    Salvar
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </AppBodyContainer>
</template>

<script lang='ts'>
import Vue from 'vue';
import { EUserProfile } from '~/store/user';
import validateMixin from '~/mixins/validateMixin';
import { mapActions, mapGetters } from 'vuex';
import { defaultMessages, TSnackbarPayload } from '~/store/snackbar';
import { AxiosError } from 'axios';
import { ESolicitationTypes } from '~/store/solicitations';

type TUpdateForm = {
  fullName: string;
  email: string;
  profile: EUserProfile;
  nutritionistId: number;
}

export default Vue.extend({
  computed: {
    ...mapGetters({
      nutritionists: 'user/nutritionists'
    }),
    EUserProfile() {
      return EUserProfile;
    }
  },
  mixins: [ validateMixin ],
  head() {
    return {
      title: 'Perfil'
    };
  },

  data() {
    const userProfileOptions = [
      { id: 1, label: 'Paciente', value: EUserProfile.PATIENT },
      { id: 2, label: 'Nutricionista', value: EUserProfile.NUTRITIONIST }
    ];

    return {
      user: this.$auth.user as TUpdateForm,
      updateFormValid: null,
      updateForm: {} as TUpdateForm,
      userProfileOptions
    };
  },

  methods: {
    ...mapActions({
      getUsers: 'user/getUsers',
      updateUser: 'user/updateUser',
      createSolicitation: 'solicitations/createSolicitation'
    }),
    async showSnackbar({ message, type }: TSnackbarPayload) {
      await this.$notifier.showMessage({ message, type });
    },

    async handleRequestConsult() {
      if (this.$auth.user?.nutritionistId) {
        this.$nuxt.$loading.start();

        const payload = {
          userId: this.$auth.user?.id,
          nutritionistId: this.$auth.user?.nutritionistId,
          solicitationType: ESolicitationTypes.CONSULT
        };

        try {
          await this.createSolicitation({ ...payload });

          await this.showSnackbar({ message: 'Consulta solicitada com sucesso!', type: 'success' });
        } catch (err) {
          const message = (err as AxiosError).response?.data.message || defaultMessages.errorStore.message;
          await this.showSnackbar({ message, type: 'error' });
        } finally {
          this.$nuxt.$loading.finish();
        }
      }
    },

    async handleUpdateForm() {
      (this.$refs.registerFormRef as VForm)?.validate();
      if (this.updateFormValid) {
        try {
          this.$nuxt.$loading.start();

          await this.updateUser({ userId: this.$auth.user.id, payload: { ...this.updateForm } });

          await this.showSnackbar({ ...defaultMessages.successUpdate });
        } catch (err) {
          let message = (err as AxiosError).response?.data.message || defaultMessages.errorStore.message;
          await this.showSnackbar({ type: 'error', message });
        } finally {
          this.$nuxt.$loading.finish();
        }
      }
    }
  },

  created() {
    this.$nuxt.$nextTick(async () => {
      try {
        this.$nuxt.$loading.start();

        await this.getUsers();

        this.updateForm = { ...this.user };
      } finally {
        this.$nuxt.$loading.finish();
      }
    });
  }
});
</script>