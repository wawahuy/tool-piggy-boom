import http from "http";
import { URL } from "url";
import httpProxy from "http-proxy";
import { ungzip } from "node-gzip";
import { Readable } from "stream";
import { appConfigs } from "./configs/app";
import InjectHost from "./injects/inject_host";
import { NetworkDataDirector } from "./wsclient/network_data";
import { ETypeData } from "./models/network_data";
import getIp, { isIpLocal } from "./helpers/get_ip";

export default class ProxyHTTPHandler {
  private proxy!: httpProxy;
  private inject: InjectHost;
  private networkData: NetworkDataDirector;

  private get urlReq() {
    if (!this.req.url) {
      return null;
    }
    const baseURL = "http://" + this.req.headers.host + "/";
    const url = new URL(this.req.url, baseURL);
    return url;
  }

  private get isHostGame() {
    return this.urlReq?.hostname === appConfigs.HOST_GAME;
  }

  private constructor(
    private req: http.IncomingMessage,
    private res: http.ServerResponse
  ) {
    this.networkData = NetworkDataDirector.getInstance();
    this.inject = new InjectHost(req);
    this.handler();
  }

  static create(req: http.IncomingMessage, res: http.ServerResponse) {
    return new ProxyHTTPHandler(req, res);
  }

  private async handler() {
    if (!this.req.url) {
      return;
    }

    /// denice loop-back
    const urlReq = this.urlReq;
    if (
      (urlReq?.hostname === getIp() || isIpLocal(urlReq?.hostname)) &&
      urlReq?.port === appConfigs.PORT
    ) {
      this.res.destroy();
      return;
    }

    /// maintance mode
    if (this.checkMaintanceMode()) {
      return;
    }

    /// dif ws protocol, modify data request
    if (this.req.headers["upgrade"] !== "websocket") {
      const success = await this.captureRequestData();
      if (!success) {
        this.networkData.request(ETypeData.HTTP);
        this.res.destroy();
        return;
      }
    }

    /// proxy net
    try {
      let url = this.urlReq;
      if (!url) {
        return;
      }
      const target = url.protocol + "//" + url.host;
      this.proxy = httpProxy.createProxyServer({});
      this.proxy.on("proxyRes", this.captureResponseData.bind(this));
      this.proxy.on("error", function (err, req, res) {
        res.end();
      });
      this.proxy.web(this.req, this.res, { target, selfHandleResponse: true });
    } catch (e) {
      console.log(e);
    }
  }

  private async captureRequestData() {
    const reqDatas: Buffer[] = [];
    for await (let chunk of this.req) {
      reqDatas.push(chunk);
    }
    const reqData = Buffer.concat(reqDatas);
    this.networkData.request(ETypeData.HTTP, reqData?.length || 0);

    // inject data
    this.inject.setRequestData(reqData);
    const reqDataInject = await this.inject.getRequestInject();
    if (this.inject.cancelRequest) {
      return false;
    }

    // inject header
    if (this.req.headers["content-length"]) {
      this.req.headers["content-length"] = reqDataInject?.length.toString();
    }

    // create readable stream
    const readable = new Readable();
    readable._read = (size: number) => {
      readable.push(reqDataInject);
      readable.push(null);
    };

    // inject method
    this.req.pipe = <T extends NodeJS.WritableStream>(
      destination: T,
      options?: { end?: boolean }
    ): T => {
      readable.pipe(destination, options);
      return destination;
    };

    return true;
  }

  private captureResponseData(
    proxyRes: http.IncomingMessage,
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) {
    if (!this.proxy) {
      return;
    }
    const resDatas: Buffer[] = [];

    proxyRes.on("data", (chunk) => {
      resDatas.push(chunk);
    });

    proxyRes.on("end", async () => {
      const resData = Buffer.concat(resDatas);
      const isCompressed = proxyRes.headers["content-encoding"] === "gzip";
      const resDataDecompressed = isCompressed
        ? await ungzip(resData).catch((e) => null)
        : resData;
      await this.handleResponse(res, resDataDecompressed);
      this.networkData.response(ETypeData.HTTP, resData?.length || 0);
    });

    proxyRes.on("error", (e) => {
      res.destroy(e);
    });
  }

  private async handleResponse(
    resTarget: http.ServerResponse,
    data: Buffer | null
  ) {
    let resData: Buffer | string | null = data;
    if (this.isHostGame && resData) {
      this.inject.setResponseData(resData);
      resData = await this.inject.getResponseInject();
    }
    resTarget.end(resData);
  }

  private checkMaintanceMode() {
    const maintance = this.networkData.getMaintaince();
    if (
      !maintance?.status ||
      this.urlReq?.pathname == "/planetpigth/m/appUpdate/check/"
    ) {
      return false;
    }

    const dataMaintance = {
      _t: new Date().getTime() / 1000,
      _s: [],
      _d: {
        ret: -20000,
        msg: maintance.msg,
      },
    };
    this.res.write(JSON.stringify(dataMaintance));
    this.res.end();
    return true;
  }
}
