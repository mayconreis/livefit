import { ActionTree, MutationTree, GetterTree } from 'vuex';
import Routine from '~/models/Routine';

export enum EMealsPeriod {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING'
}

export type TMealItemsPayload = {
  item: string,
  quantity: string
}

export type TMealOptionsPayload = {
  items: TMealItemsPayload[]
}

export type TMealsPayload = {
  period: EMealsPeriod,
  time: string,
  mealOptions: TMealOptionsPayload[]
}

export type TRoutinePayload = {
  patientId: number;
  meals: TMealsPayload[]
}

export type TMealsItemsResponse = {
  id: number,
  item: string,
  quantity: string,
  meailOptionId: string
}

export type TMealsOptionsResponse = {
  id: number,
  mealId: number,
  items: TMealsItemsResponse[]
}

export type TMealsResponse = {
  id: number,
  time: string,
  period: EMealsPeriod,
  routineId: number,
  options: TMealsOptionsResponse[]
}

export type TRoutineResponse = {
  id: number,
  patientId: number,
  nutritionistId: number,
  meals: TMealsResponse[]
}
export type TMealItemsUpdatePayload = {
  id: number,
  item: string,
  quantity: string
}

export type TMealsUpdatePayload = {
  id: number,
  time: string,
  period: EMealsPeriod,
  mealItems: TMealItemsUpdatePayload[]
}

export type TRoutineUpdatePayload = {
  meals: TMealsUpdatePayload[]
}

export const state = () => ({
  routines: [],
  routine: {}
});

export type TRoutinesState = ReturnType<typeof state>

export const actions: ActionTree<TRoutinesState, TRoutinesState> = {
  async getRoutines({ commit }): Promise<void> {
    const data = await Routine.get() as unknown as TRoutineResponse[];

    await commit('SET_ROUTINES', data ?? []);
  },

  async getRoutineByPatient({ commit }, { id, nutritionistId }: {
    id: number;
    nutritionistId?: number
  }): Promise<void> {
    const data = await Routine.config({
      url: `/routines/patient/${ id }?filter[nutritionistId]=${ nutritionistId }`,
      method: 'GET'
    }).get() as unknown as TRoutineResponse;

    await commit('SET_ROUTINE', data ?? {});
  },

  async createRoutine({ commit }, payload: TRoutinePayload): Promise<void> {
    await new Routine({ ...payload }).save();
  },

  async updateRoutine({ commit }, { routineId, payload }): Promise<void> {
    await Routine.config({ url: `/routines/${ routineId }`, method: 'PUT', data: payload }).get()
  },

  async setRoutine({ commit }, data): Promise<void> {
    await commit('SET_ROUTINE', data ?? {});
  },

  async deleteRoutine({ commit }, routineId: number): Promise<void> {
    const response = await this.$axios.$delete(`/routines/${ routineId }`);
  }
};

export const mutations: MutationTree<TRoutinesState> = {
  SET_ROUTINES(state, data) {
    state.routines = data;
  },

  SET_ROUTINE(state, data) {
    state.routine = data[0];
  }
};

export const getters: GetterTree<TRoutinesState, TRoutinesState> = {
  routine: (state) => state.routine
};