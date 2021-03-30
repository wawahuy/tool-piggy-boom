import querystring from 'querystring';
import InjectAbstract from "../inject_abstract";

export default class InjectMagicShoot extends InjectAbstract {
  async handlerRequest(): Promise<string | Buffer | null> {
    if (!this.requestData) {
      return this.requestData;
    }

    const oReq = querystring.parse(this.requestData.toString('utf-8'));
    if (oReq?.boxId == '-1') {
      this.cancelRequest = true;
      return null;
    }

    return this.requestData;
  }

  async handlerResponse(): Promise<string | Buffer | null> {
    return this.responseData;
  }
  
}