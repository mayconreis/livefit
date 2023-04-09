import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $notifier: {
      showMessage({ message, type }: { message: string; type: string }): Promise<void>
    };
  }
}
