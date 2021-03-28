import addUser from "./helpers/add_user";

export default class InjectHTTP {
  constructor(
    private requestData: Buffer | string,
    private data: Buffer | string,
    private pathName: string
  ) {
  }  

  async getDataInject(): Promise<Buffer | string> {
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

    const res = await addUser(this.requestData.toString(), strData);
    const newData = JSON.parse(strData);
    newData._d.name = (<any>res).msg;
    return JSON.stringify(newData);
  }
}