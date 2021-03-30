import Store from "./store";

export default class StoreDirector {
  private static _instance: StoreDirector = new StoreDirector();
  private stores: { [key: string]: Store } = {};

  constructor() {}

  static getInstance() {
    return StoreDirector._instance;
  }

  get(storeId: string) {
    let store = this.stores?.[storeId];
    if (!store) {
      store = new Store();
      this.stores[storeId] = store;
    }
    return store;
  }
}
