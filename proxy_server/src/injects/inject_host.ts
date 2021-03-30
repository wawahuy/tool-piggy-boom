import http from 'http';
import InjectAbstract from "./inject_abstract";
import InjectRoute from "./inject_route";

export default class InjectHost {
  private requestData!: Buffer | null;
  private responseData!: Buffer | null;
  private inject!: InjectAbstract | null;

  private get urlRequest() {
    if (!this.request.url) {
      return null;
    }
    const baseURL = "http://" + this.request.headers.host + "/";
    const url = new URL(this.request.url, baseURL);
    return url;
  }

  constructor(
    private request: http.IncomingMessage
  ) {
    const url = this.urlRequest;
    if (url?.hostname === 'd2fd20abim5npz.cloudfront.net') {
      this.inject = InjectRoute.getInstance().getInject(url.pathname);
    }
  }  

  setRequestData(requestData: Buffer | null) {
    this.requestData = requestData;
    this.inject?.setRequestData(requestData);
  }

  setResponseData(responseData: Buffer | null) {
    this.responseData = responseData;
    this.inject?.setResponseData(responseData);
  }

  async getRequestInject(): Promise<Buffer | string | null> {
    if (this.inject) {
      return this.inject?.handlerRequest();
    }
    return this.requestData;
  }

  async getResponseInject(): Promise<Buffer | string | null> {
    if (this.inject) {
      return this.inject?.handlerResponse();
    }
    return this.responseData;
  }
}