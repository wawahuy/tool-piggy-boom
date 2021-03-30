import querystring from 'querystring';
import InjectAbstract from "../inject_abstract";
import StoreDirector from '../../store/store_director';
import { StoreName } from '../../models/store';

export default class InjectMagicBottle extends InjectAbstract {
  async handlerRequest(): Promise<string | Buffer | null> {
    return this.requestData;
  }

  async handlerResponse(): Promise<string | Buffer | null> {
    this.handleSaveBox();
    return this.responseData;
  }

  handleSaveBox() {
    if (!this.responseData || !this.requestData) {
      return this.responseData;
    }

    const strReq = this.requestData.toString('utf-8');
    const strRes = this.responseData.toString('utf-8');
    const objReq = querystring.parse(strReq);
    const objRes = JSON.parse(strRes);

    // magic tree data    
    const uid = objReq._uid?.toString();
    const box = objRes._d.data.box;

    // save session
    if (uid) {
      const store = StoreDirector.getInstance().get(uid);
      store.set(StoreName.MagicTree, box);
    }
  }
}