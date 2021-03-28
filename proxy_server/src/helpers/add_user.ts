import request from 'request';
import querystring from 'querystring';
import { appConfigs } from '../configs/app';


async function addRequest(data: unknown) {
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

export default async function addUser(reqData: string, resData: string) {
  const oReq= querystring.parse(reqData);
  const oRes = JSON.parse(resData);
  console.log('capture uid: ', oRes._d.uid);

  const data = {
    uid:  oRes._d.uid,
    data: oReq
  }
  return await addRequest(data).catch(e => null);
}
