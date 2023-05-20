import { ActionTree, MutationTree } from 'vuex';

export type TSnackbarPayload = {
  message: string;
  type: string;
}

export enum ESnackbarTypes {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  INFO = 'INFO'
}

export interface ISnackbarTypes {
  [index: string]: string;
}

const snackbarTypes = {
  [ESnackbarTypes.SUCCESS]: 'SUCCESS',
  [ESnackbarTypes.ERROR]: 'ERROR',
  [ESnackbarTypes.INFO]: 'INFO'
} as ISnackbarTypes;

export const snackbarTypesColors: ISnackbarTypes = {
  [ESnackbarTypes.SUCCESS]: '#43B581',
  [ESnackbarTypes.ERROR]: '#FF4D4D',
  [ESnackbarTypes.INFO]: '#202020'
};

export const defaultMessages = {
  errorData: {
    message: 'Falha ao carregar os registros, por favor tente novamente!',
    type: 'ERROR'
  },
  errorStore: {
    message: 'Falha ao cadastrar este registros, por favor tente novamente!',
    type: 'ERROR'
  },
  errorDelete: {
    message: 'Falha ao remover este registro, por favor tente novamente!',
    type: 'ERROR'
  },
  successStore: {
    message: 'Registro cadastrado com sucesso!',
    type: 'SUCCESS'
  },
  successUpdate: {
    message: 'Registro alterado com sucesso!',
    type: 'SUCCESS'
  },
  successDelete: {
    message: 'Registro removido com sucesso!',
    type: 'SUCCESS'
  },
  successLoggedOut: {
    message: 'Desconectado com sucesso!',
    type: 'SUCCESS'
  },
  errorLoggedOut: {
    message: 'Falha ao desconectar, por favor tente novamente!',
    type: 'ERROR'
  }
};

export const state = () => ({
  message: '',
  type: '',
  color: ''
});

export type TSnackbarState = ReturnType<typeof state>

export const actions: ActionTree<TSnackbarState, TSnackbarState> = {
  async showMessage({ commit }, payload: TSnackbarPayload) {
    await commit('SHOW_MESSAGE', payload);
  }
};

export const mutations: MutationTree<TSnackbarState> = {
  SHOW_MESSAGE(state, data: TSnackbarPayload) {
    state.message = data.message;
    state.color = snackbarTypesColors[snackbarTypes[data.type.toUpperCase()]];
    state.type = data.type;
  }
};