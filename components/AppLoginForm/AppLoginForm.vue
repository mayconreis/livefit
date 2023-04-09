<template>
  <v-row justify='center'>
    <v-dialog v-model='show' max-width='600'>
      <v-card>
        <v-app-bar>
          <v-card-title>Login</v-card-title>
          <v-spacer />
          <v-btn icon @click.stop.prevent='show = false'>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>
        <v-card-text>
          <v-container>
            <v-form ref='loginFormRef' v-model='loginFormValid'>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model='loginForm.email'
                    label='Email'
                    placeholder='Email'
                    outlined
                    autofocus
                    type='text'
                    prepend-inner-icon='mdi-account'
                    :rules='rules.required'>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model='loginForm.password'
                    label='Senha'
                    placeholder='Senha'
                    outlined
                    :type='seePassword ? "text" : "password"'
                    :rules='rules.required'
                    prepend-inner-icon='mdi-lock'
                  >
                    <template #append>
                      <v-btn icon @click.stop.prevent='setSeePassword(!seePassword)'>
                        <v-icon color='secondary'>{{ seePassword ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-container>
            <v-row>
              <v-col>
                <v-btn color='primary' :disabled='!loginFormValid' @click.stop.prevent='handleLogin'>
                  Entrar
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
import { AxiosError } from 'axios';
import { TSnackbarPayload } from '~/store/snackbar';

type TLoginForm = {
  email: string;
  password: string;
}

export default Vue.extend({
  name: 'AppLoginForm',
  mixins: [ validateMixin ],
  data() {
    return {
      show: false,
      seePassword: false,
      loginFormValid: null,
      loginForm: {} as TLoginForm
    };
  },

  created() {
    this.$nuxt.$on('toggleLoginDialog', () => {
      this.show = true;
    });
  },

  methods: {
    setSeePassword(value: boolean) {
      this.seePassword = value;
    },

    showSnackbar({ message, type }: TSnackbarPayload) {
      this.$notifier.showMessage({ message, type });
    },

    async handleLogin() {
      (this.$refs.loginFormRef as VForm)?.validate();
      if (this.loginFormValid) {
        try {
          this.$nuxt.$loading.start();

          await this.$auth.loginWith('local', { data: this.loginForm });

          await this.$router.push('/client');
        } catch (error) {
          const message = (error as AxiosError).response?.data.message || 'Ocorreu um erro inesperado, por favor tente novamente em instantes.';
          this.showSnackbar({ message, type: 'error' });
        } finally {
          this.$nuxt.$loading.finish();
        }
      }
    }
  }
});
</script>