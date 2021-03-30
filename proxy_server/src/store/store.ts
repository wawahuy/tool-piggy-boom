export default class Store {
  private data: { [key: string]: any } = {};

  constructor() {}

  set(key: string | number, data: any) {
    this.data[key] = data;
  }

  get(key: string | number) {
    return this.data?.[key];
  }
}