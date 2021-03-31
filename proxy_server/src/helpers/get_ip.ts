import { networkInterfaces } from "os";
import request from "request";
import { appConfigs } from "../configs/app";

export const getIpInterface = () => {
  const results = [];
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets?.[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        results.push(net.address);
      }
    }
  }
  return results?.[0];
};

export const getIpLookup = async (): Promise<string> => {
  return new Promise((res, rej) => {
    request(appConfigs.API_IP_LOOKUP, (e, response) => {
      if (e) {
        rej(e);
      } else {
        res(JSON.parse(response.body)?.ip);
      }
    });
  });
};

export default async function getIp(): Promise<string | null> {
  if (appConfigs.IS_DEVELOPMENT) {
    return getIpInterface();
  }

  const ip = await getIpLookup().catch(e => null);
  return ip;
}
