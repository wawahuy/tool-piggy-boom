import querystring from 'querystring';
import InjectAbstract from "../inject_abstract";
import StoreDirector from '../../store/store_director';
import { StoreName } from '../../models/store';

export default class InjectMagicShootAuto extends InjectAbstract {
  async handlerRequest(): Promise<string | Buffer | null> {
    if (!this.requestData) {
      return this.requestData;
    }

    const oReq = querystring.parse(this.requestData.toString('utf-8'));
    const uid = oReq._uid?.toString();
    
    if (oReq?.boxId == '-1' && uid) {
      const store = StoreDirector.getInstance().get(uid);
      const box = <number[]>store.get(StoreName.MagicTree);
      const index = box?.findIndex(n => n == 1);

      if (index) {
        oReq.boxId = (index + 1).toString();
      } else {
        delete oReq.boxId;
      }
      return Buffer.from(querystring.stringify(oReq), 'utf-8');
    }

    return this.requestData;
  }

  async handlerResponse(): Promise<string | Buffer | null> {
    if (!this.responseData || !this.requestData) {
      return this.responseData;
    }

    const strReq = this.requestData.toString('utf-8');
    const strRes = this.responseData.toString('utf-8');
    const objReq = querystring.parse(strReq);
    const objRes = JSON.parse(strRes);

    // magic tree data    
    const uid = objReq._uid?.toString();
    const box = objRes?._d?.data?.targetBox;

    // save session
    if (uid) {
      const store = StoreDirector.getInstance().get(uid);
      store.set(StoreName.MagicTree, box);
    }

    return this.responseData;
  }
  
}