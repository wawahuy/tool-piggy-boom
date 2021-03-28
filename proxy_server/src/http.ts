import http from "http";
import { URL } from "url";
import httpProxy from "http-proxy";
import { ungzip } from "node-gzip";
import { appConfigs } from "./configs/app";
import InjectHTTP from "./injectHttp";

export default class ProxyHTTPHandler {
  private proxy!: httpProxy;
  private reqData!: Buffer | null;
  private resData!: Buffer | null;

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
    this.handler();
  }

  static create(req: http.IncomingMessage, res: http.ServerResponse) {
    return new ProxyHTTPHandler(req, res);
  }

  private handler() {
    if (!this.req.url) {
      return;
    }
    try {
      let url = this.urlReq;
      if (!url) {
        return;
      }
      const target = url.protocol + "//" + url.host;

      this.captureRequestData();
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
    return new Promise((resolve, reject) => {
      const reqData: Buffer[] = [];
      this.req.on("error", (e) => {
        reject(e);
      });
      this.req.on("data", (chunk) => {
        reqData.push(chunk);
      });
      this.req.on("end", () => {
        this.reqData = Buffer.concat(reqData);
        resolve(this.reqData);
      });
    });
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
      this.resData = isCompressed
        ? await ungzip(resData).catch((e) => null)
        : resData;
      await this.handleResponse(res);
    });

    proxyRes.on("error", (e) => {
      res.destroy(e);
    });
  }

  private async handleResponse(resTarget: http.ServerResponse) {
    let resData: Buffer | string | null = this.resData;
    if (this.isHostGame && resData) {
      const inject = new InjectHTTP(
        this.reqData,
        resData,
        this.urlReq?.pathname || ""
      );
      resData = await inject.getDataInject();
    }
    resTarget.end(resData);
  }
}
