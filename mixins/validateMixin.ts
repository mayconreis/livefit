import Vue from 'vue';

export default Vue.extend({
  data: () => ({
    rules: {
      required: [
        (value: string | string[]) => {
          if (value instanceof Array) return value?.length > 0 || 'O campo é obrigatório';
          return !!value || 'O campo é obrigatório';
        }
      ],
      email: [
        (value: string) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gim.test(value)
          || 'Email inválido'
      ]
    }
  }),

  methods: {
    ruleIsEquals(valueToCompare: string) {
      return [ (value: string) => value === valueToCompare || `Os valores não são iguais` ];
    },
    ruleMinCount(minValue = 8) {
      return [ (value: string) => String(value)?.length >= minValue || `O campo deve ser maior ou igual há ${ minValue } caracteres` ];
    }
  }
});