import InjectAbstract from "./inject_abstract";
import InjectLogin from "./routes/inject_login";
import InjectMagicDetail from "./routes/inject_magic_detail";
import InjectMagicShoot from "./routes/inject_magic_shoot";

export type ClazzInjectAbstract = new (
  requestData?: Buffer | null,
  responseData?: Buffer | null
) => InjectAbstract;

export default class InjectRoute {
  private static _instance: InjectRoute = new InjectRoute();
  private _routes: { [key: string]: ClazzInjectAbstract } = {};

  private constructor() {
    this.route("/planetpigth/m/gameNew/login/", InjectLogin);
    this.route("/planetpigth/m/magicTree/shot/", InjectMagicShoot);
    this.route("/planetpigth/m/action/detail/", InjectMagicDetail);
  }

  static getInstance() {
    return InjectRoute._instance;
  }

  route(path: string, inject: ClazzInjectAbstract) {
    this._routes[path] = inject;
  }

  getInject(
    path: string,
    requestData?: Buffer | null,
    responseData?: Buffer | null
  ): InjectAbstract | null {
    const clazz = this._routes?.[path];
    if (clazz) {
      return new clazz(requestData, responseData);
    }
    return null;
  }
}
