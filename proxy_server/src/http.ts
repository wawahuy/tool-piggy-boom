import http from "http";
import { URL } from "url";
import httpProxy from "http-proxy";
import { ungzip } from "node-gzip";
import { Readable, PassThrough } from "stream";
import { appConfigs } from "./configs/app";
import InjectHost from "./injects/inject_host";
import { NetworkCountDirector } from "./wsclient/network_count_director";
import { ETypeData } from "./models/network_count_director";

export default class ProxyHTTPHandler {
  private proxy!: httpProxy;
  private inject: InjectHost;

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


    if (this.req.headers['upgrade'] !== 'websocket') {
      const success = await this.captureRequestData();
      if (!success) {
        NetworkCountDirector.getInstance().request(ETypeData.HTTP);
        this.res.destroy();
        return;        
      }
    }

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
    NetworkCountDirector.getInstance().request(ETypeData.HTTP, reqData.length);

    // inject data
    this.inject.setRequestData(reqData);
    const reqDataInject = await this.inject.getRequestInject();
    if (this.inject.cancelRequest) {
      return false;
    }

    // inject header
    if (this.req.headers['content-length']) {
      this.req.headers['content-length'] = reqDataInject?.length.toString();
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
    });

    proxyRes.on("error", (e) => {
      res.destroy(e);
    });
  }

  private async handleResponse(resTarget: http.ServerResponse, data: Buffer | null) {
    let resData: Buffer | string | null = data;
    if (this.isHostGame && resData) {
      this.inject.setResponseData(resData);
      resData = await this.inject.getResponseInject();
    }
    resTarget.end(resData);
  }
}
