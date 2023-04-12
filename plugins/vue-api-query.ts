import { Model } from 'vue-api-query';
import { Context, Inject } from '@nuxt/types/app';

export default function(ctx: Context, inject: Inject) {
  Model.$http = ctx.$axios;
}