import { ActionTree, GetterTree, MutationTree } from 'vuex';
import AxiosRequestConfig from '@nuxtjs/axios';

export enum ESolicitationTypes {
  ROUTINE = 'ROUTINE',
  CONSULT = 'CONSULT'
}

export type TParams = {
  filter: Record<string, string>,
  include: string
}

export type TSolcitationPayload = {
  userId: number;
  nutritionistId: number;
  solicitationType: ESolicitationTypes;
}

export type TSolicitationResponse = {
  id: number;
  userId: number;
  nutritionistId: number;
  solicitationType: ESolicitationTypes;
  finished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TSolicitationFilter = {
  userId: number;
  nutritionistId: number;
  solicitationType: ESolicitationTypes;
}

export const state = () => ({
  solicitations: [] as TSolicitationResponse[],
  solicitation: {} as TSolicitationResponse
});

export type TSolicitationState = ReturnType<typeof state>

export const actions: ActionTree<TSolicitationState, TSolicitationState> = {
  async getSolicitations({ commit }, { filter, include }: TParams): Promise<void> {
    let params: Record<string, string> = {};

    for (const [ key, value ] of Object.entries(filter)) {
      params[`filter[${ key }]`] = String(value);
    }

    const data = await this.$axios.$get('/solicitations', { params: { ...params, include } });

    await commit('SET_SOLICITATIONS', data ?? []);
  },

  async createSolicitation({ commit }, payload: TSolcitationPayload): Promise<void> {
    const data = await this.$axios.$post('/solicitations', { ...payload });

    await commit('SET_SOLICITATION', data ?? {})
  }
};

export const mutations: MutationTree<TSolicitationState> = {
  SET_SOLICITATIONS(state, data) {
    state.solicitations = data;
  },

  SET_SOLICITATION(state, data ) {
    state.solicitation = data;
  }
};

export const getters: GetterTree<TSolicitationState, TSolicitationState> = {
  solicitations: (state): TSolicitationResponse[] => state.solicitations
};