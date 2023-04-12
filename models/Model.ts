import { HTTPRequestConfig, Model as BaseModel } from 'vue-api-query';

export default class Model extends BaseModel {
  baseURL(): string {
    return String('http://localhost:5000/api')
  }

  request(config: HTTPRequestConfig) {
    return this.$http.request(config);
  }
}