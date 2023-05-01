<template>
  <v-row justify='center'>
    <v-dialog v-model='show' max-width='600'>
      <v-card>
        <v-app-bar>
          <v-card-title>Cadastro</v-card-title>
          <v-spacer />
          <v-btn icon @click.stop.prevent='show = false'>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>
        <v-card-text>
          <v-container>
            <v-form ref='registerFormRef' v-model='registerFormValid'>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model='registerForm.fullName'
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
                    v-model='registerForm.email'
                    label='Email'
                    placeholder='Email'
                    outlined
                    counter='150'
                    type='text'
                    prepend-inner-icon='mdi-email'
                    :rules='[...rules.required, ...rules.email]'>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model='registerForm.password'
                    label='Senha'
                    placeholder='Senha'
                    outlined
                    counter='50'
                    :type='seePassword ? "text" : "password"'
                    prepend-inner-icon='mdi-lock'
                    :rules='[...rules.required, ...ruleMinCount(8)]'
                    :append-icon='seePassword ? "mdi-eye-off" : "mdi-eye"'
                    @click:append.stop.prevent='setSeePassword(!seePassword)'
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model='registerForm.confirmPassword'
                    label='Confirmação de senha'
                    placeholder='Confirmação de senha'
                    outlined
                    counter='50'
                    :type='seePassword ? "text" : "password"'
                    prepend-inner-icon='mdi-lock'
                    :rules='[...rules.required, ...ruleIsEquals(registerForm.password)]'>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-radio-group row :rules='[...rules.required]' v-model='registerForm.profile'>
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
                <v-btn color='primary' :disabled='!registerFormValid' @click.stop.prevent='handleRegisterForm'>
                  Cadastrar
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang='ts'>
import Vue from 'vue';
import validateMixin from '~/mixins/validateMixin';
import { defaultMessages, TSnackbarPayload } from '~/store/snackbar';
import { EUserProfile } from '~/store/user';
import { mapActions } from 'vuex';
import { AxiosError } from 'axios';

type TRegisterForm = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profile: EUserProfile
}

export default Vue.extend({
  name: 'AppRegisterForm',
  mixins: [ validateMixin ],
  data() {
    const userProfileOptions = [
      { id: 1, label: 'Paciente', value: EUserProfile.PATIENT },
      { id: 2, label: 'Nutricionista', value: EUserProfile.NUTRITIONIST }
    ];

    const registerDefaultValues: TRegisterForm = {
      profile: EUserProfile.PATIENT,
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    return {
      show: false,
      seePassword: false,
      registerFormValid: null,
      registerForm: {} as TRegisterForm,
      userProfileOptions,
      registerDefaultValues
    };
  },

  created() {
    this.registerForm = {
      ...this.registerDefaultValues
    };
    this.$nuxt.$on('toggleRegisterDialog', () => {
      this.show = true;
    });
  },

  methods: {
    ...mapActions({
      'createUser': 'user/createUser'
    }),
    setSeePassword(value: boolean) {
      this.seePassword = value;
    },

    showSnackbar({ message, type }: TSnackbarPayload) {
      this.$notifier.showMessage({ message, type });
    },

    async handleRegisterForm() {
      (this.$refs.registerFormRef as VForm)?.validate();
      if (this.registerFormValid) {
        try {
          this.$nuxt.$loading.start();

          await this.createUser(this.registerForm);

          this.show = false;
        } catch (err) {
          let message = (err as AxiosError).response?.data.message || defaultMessages.errorStore.message;
          this.showSnackbar({ type: 'error', message });
        } finally {
          this.$nuxt.$loading.finish();
        }
      }
    }
  }
});
</script>