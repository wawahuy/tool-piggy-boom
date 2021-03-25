import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import querystring from "querystring";
import * as _ from "lodash";
import {
  GameServiceConfig,
  GameServiceResponse,
} from "../models/game_req/game";
import GameApiConfig from "../../configs/game";
import moment from "moment";
import { BCLogTypeAdGiftBox } from "games/models/game_req/bclog";
import { RewardAdType } from "games/models/game_req/reward";
import { logger } from "../../helpers/logger";

class BCLogService {
  _client: AxiosInstance;

  get req() {
    return this._client;
  }

  constructor() {
    const options: AxiosRequestConfig = {
      baseURL: GameApiConfig.baseBCLogURL,
      timeout: 30 * 1000,
      headers: this.getApiHeaders(),
    };
    this._client = Axios.create(options);
    this._client.interceptors.request.use(this.interceptorRequest.bind(this));
  }

  private getApiHeaders() {
    return {
      Expect: "100-continue",
      "X-Unity-Version": GameApiConfig.unityVersion,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": GameApiConfig.userAgent,
    };
  }

  private interceptorRequest(config: AxiosRequestConfig) {
    let data = config.data;
    if (_.isString(data)) {
      data = querystring.parse(data);
    }
    config.data = querystring.stringify(data);
    return config;
  }

  async callUserActionPlayTili(uid: string, tili: number) {
    const action = "t_user_action";
    const date = moment().format("YYYYMMDD");
    const second = Math.round(new Date().getTime() / 1000);
    const info = `${action}|${date}|${second}|planetpigth|android|android|${GameApiConfig.appVersion}|${GameApiConfig.deviceInfo}||0.0.0.0|1||${uid}|2|11|0|3||${tili}||`;
    const data = {
      type: action,
      info: Buffer.from(info).toString("base64"),
    };
    return await this.req.post('', data).catch((e: Error) => {
      logger.warning(e?.stack?.toString());
      return null;
    })
  }

  async callUserActionAdGiftBox(uid: string, type: RewardAdType, actionType: BCLogTypeAdGiftBox) {
    const action = "t_client_showad_new";
    const date = moment().format("YYYYMMDD");
    const second = Math.round(new Date().getTime() / 1000);
    const info = `${action}|${date}|${second}|planetpigth|android|android|${GameApiConfig.appVersion}|${GameApiConfig.deviceInfo}||0.0.0.0|1|vn|${uid}|${type}|${actionType}||0|`;
    const data = {
      type: action,
      info: Buffer.from(info).toString("base64"),
    };
    return await this.req.post('', data).catch((e: Error) => {
      logger.warning(e?.stack?.toString());
      return null;
    })
  }
}

export default BCLogService;
