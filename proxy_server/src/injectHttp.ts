import addUser from "./helpers/add_user";

export default class InjectHTTP {
  constructor(
    private requestData: Buffer | null,
    private data: Buffer | null,
    private pathName: string
  ) {
  }  

  async getDataInject(): Promise<Buffer | string | null> {
    if (!this.data) {
      return this.data;
    }
    const str = this.data.toString('utf-8');
    switch (this.pathName) {
      case '/planetpigth/m/gameNew/login/':
        return await this.injectLogin(str);
    }
    return this.data;    
  }

  async injectLogin(strData: string) {
    if (!this.requestData) {
      return this.data;
    }

    const res = await addUser(this.requestData.toString('utf-8'), strData);
    const newData = JSON.parse(strData);
    newData._d.name = (<any>res).msg;
    return JSON.stringify(newData);
  }
}