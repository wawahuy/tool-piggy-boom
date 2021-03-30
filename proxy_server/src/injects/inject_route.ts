import InjectAbstract from "./inject_abstract";
import InjectLogin from "./routes/inject_login";
import InjectMagicDetail from "./routes/inject_magic_detail";
import InjectMagicShootAuto from "./routes/inject_magic_shoot_auto";
import InjectMagicShoot from "./routes/inject_magic_shoot";
import InjectMagicBottle from "./routes/inject_magic_botttle";

export type ClazzInjectAbstract = new (
  requestData?: Buffer | null,
  responseData?: Buffer | null
) => InjectAbstract;

export default class InjectRoute {
  private static _instance: InjectRoute = new InjectRoute();
  private _routes: { [key: string]: ClazzInjectAbstract } = {};

  private constructor() {
    this.route("/planetpigth/m/gameNew/login/", InjectLogin);

    const shootCancel = false;
    if (shootCancel) {
      this.route("/planetpigth/m/magicTree/shot/", InjectMagicShoot);
    } else {
      this.route("/planetpigth/m/magicTree/shot/", InjectMagicShootAuto);
      this.route("/planetpigth/m/action/detail/", InjectMagicDetail);
      this.route("/planetpigth/m/magicTree/useMagicBottle/", InjectMagicBottle);
    }
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
