import { ActionTree, MutationTree } from 'vuex';
import User from '~/models/User';

export enum EUserProfile {
  PATIENT = 'PATIENT',
  NUTRITIONIST = 'NUTRITIONIST'
}

export type TUserPayload = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profile: EUserProfile
}

export type TUserResponse = {
  fullName: string;
  email: string;
  profile: EUserProfile;
  createdAt: Date;
  updatedAt: Date
}

export const state = () => ({
  user: {},
  users: []
});

export type TUserState = ReturnType<typeof state>

export const actions: ActionTree<TUserState, TUserState> = {
  async getUser({ commit }, userId: number): Promise<void> {
    const data = await User.find(userId) as unknown as TUserResponse;

    await commit('SET_USER', data || {});
  },

  async createUser({ commit }, payload: TUserPayload): Promise<void> {
    const data = await new User({ ...payload }).save();

    await commit('SET_USER', data || {});
  }
};

export const mutations: MutationTree<TUserState> = {
  SET_USER(state, data) {
    state.user = data;
  }
};