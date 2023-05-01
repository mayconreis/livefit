import { ActionTree, GetterTree, MutationTree } from 'vuex';
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

export type TUserUpdatePayload = {
  fullName?: string;
  profile?: EUserProfile;
  nutritionistId?: number;
}

export type TUserResponse = {
  id: number;
  fullName: string;
  email: string;
  nutritionistId: number;
  profile: EUserProfile;
  createdAt: Date;
  updatedAt: Date
}

export const state = () => ({
  user: {} as TUserResponse,
  users: [] as TUserResponse[]
});

export type TUserState = ReturnType<typeof state>

export const actions: ActionTree<TUserState, TUserState> = {
  async getUser({ commit }, userId: number): Promise<void> {
    const data = await User.find(userId) as unknown as TUserResponse;

    await commit('SET_USER', data || {});
  },

  async getUsers({ commit }): Promise<void> {
    const data = await User.get() as unknown as TUserResponse[      ];

    await commit('SET_USERS', data ?? []);
  },

  async createUser({ commit }, payload: TUserPayload): Promise<void> {
    const data = await new User({ ...payload }).save();

    await commit('SET_USER', data || {});
  },

  async updateUser({ commit }, { userId, payload }): Promise<void> {
    try {
      const data = await User.config({ url: `/users/${ userId }`, method: 'PATCH', data: payload }).get() as unknown as TUserResponse[];
      this.$auth.setUser(data[0]);
    } catch (err) {
      console.error(err);
    }
  }
};

export const mutations: MutationTree<TUserState> = {
  SET_USER(state, data) {
    state.user = data;
  },
  SET_USERS(state, data) {
    state.users = data;
  }
};

export const getters: GetterTree<TUserState, TUserState> = {
  nutritionists: (state): TUserResponse[] => state.users.filter(user => user.profile === EUserProfile.NUTRITIONIST),
  patients: (state) => state.users.filter(user => user.profile === EUserProfile.PATIENT),
  user: (state) => state.user
};