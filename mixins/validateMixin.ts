import Vue from 'vue';

export default Vue.extend({
  data: () => ({
    rules: {
      required: [
        (v: string | string[]) => {
          if (v instanceof Array) return v?.length > 0 || 'O campo é obrigatório';
          return !!v || 'O campo é obrigatório';
        }
      ]
    }
  })
});