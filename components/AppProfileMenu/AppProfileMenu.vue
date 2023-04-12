<template>
  <v-menu
    v-model='show'
    :close-on-content-click='false'
    :nudge-width='200'
    offset-y
    transition='slide-y-transition'
  >
    <template v-slot:activator='{ on, attrs }'>
      <v-btn
        icon
        v-bind='attrs'
        v-on='on'
      >
        <v-icon size='42'>mdi-account-circle</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-avatar>
              <v-icon size='36'>mdi-account-circle</v-icon>
            </v-avatar>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>
              {{ user.fullName }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ userProfile[user.profile] }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider />

      <AppMenuItems :navigation='profileNavigation' />
    </v-card>
  </v-menu>
</template>

<script lang='ts'>
import Vue from 'vue';
import profileNavigation from '~/components/AppProfileMenu/profileNavigation';
import { EUserProfile, TUserResponse } from '~/store/user';

export default Vue.extend({
  name: 'AppProfileMenu',
  data() {
    const userProfile = {
      [EUserProfile.PATIENT]: 'Paciente',
      [EUserProfile.NUTRITIONIST]: 'Nutricionista'
    };
    return {
      show: false,
      user: this.$auth.user as TUserResponse,
      profileNavigation,
      userProfile
    };
  }
});
</script>