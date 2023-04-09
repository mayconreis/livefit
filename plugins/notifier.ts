import { Context, Inject } from '@nuxt/types/app';

export default ({ store }: Context, inject: Inject) => {
  inject('notifier', {
    async showMessage({ message = '', type = '' }): Promise<void> {
      await store.dispatch('snackbar/showMessage', { message, type });
    }
  });
}