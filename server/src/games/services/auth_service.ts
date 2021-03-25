import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  GameServiceResponse,
} from "../models/game_req/game";
import GameApiConfig from "../../configs/game";
import querystring from "querystring";
import * as _ from "lodash";
import { AuthRequest, AuthResponse } from "games/models/game_req/auth";
import { logger } from "../../helpers/logger";

export default class AuthService {
  _client: AxiosInstance;

  get req() {
    return this._client;
  }

  constructor() {
    const options: AxiosRequestConfig = {
      baseURL: GameApiConfig.baseURL,
      timeout: 30 * 1000,
      headers: this.getApiHeaders(),
      responseType: "json",
      transformResponse: this.interceptorResponse.bind(this),
    };
    this._client = axios.create(options);
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

    data = {
      _version: GameApiConfig.appVersion,
      _device: "android",
      _channel: "android",
      _lan: "vi_vn",
      _time: new Date().getTime(),
      ...data,
    };

    config.data = querystring.stringify(data);
    return config;
  }

  private interceptorResponse(data: any, headers: any) {
    let dataObject: GameServiceResponse;
    try {
      dataObject = JSON.parse(data);
      if (dataObject && dataObject?._d?.ret === 0) {
        return dataObject._d;
      }
    } catch (e) {
      console.log(e);
    }
    return null;
  }

  async login(data: AuthRequest): Promise<AuthResponse | null> {
    return await this.req
      .post("gameNew/login/", data)
      .then((r) => r.data)
      .catch((e: Error) => {
        logger.warn(e?.stack?.toString());
        return null;
      });
  }
}
