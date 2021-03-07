import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import querystring from "querystring";
import * as _ from "lodash";
import { GameServiceConfig, GameServiceResponse } from "../models/game_req/game";
import GameApiConfig from "../../configs/game";

class GameService {
  _client: AxiosInstance;

  get req() {
    return this._client;
  }

  constructor(private _config: GameServiceConfig) {
    const options: AxiosRequestConfig = {
      baseURL: GameApiConfig.baseURL,
      timeout: 30 * 1000,
      headers: this.getApiHeaders(),
      responseType: "json",
      transformResponse: this.interceptorResponse.bind(this),
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
      "Cookie": `deviceToken=${this._config.deviceToken};`
    };
  }

  private interceptorRequest(config: AxiosRequestConfig) {
    let data = config.data;
    if (_.isString(data)) {
      data = querystring.parse(data);
    }

    data = {
      _mtkey: this._config.mtkey,
      _skey: this._config.skey,
      _uid: this._config.uid,
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
      if (dataObject) {
        return dataObject._d;
      }
    } catch (e) {
      console.log(e);
    }
    return null;
  }
}

export default GameService;
