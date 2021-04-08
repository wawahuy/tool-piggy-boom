import { Request, Response } from "express";
import { wsProxyManager } from "../../../realtimes/proxy";

export default class ProxyController {
  static async bestProxy(req: Request, res: Response) {
    const proxies = wsProxyManager.getClients();
    const proxyIds = Object.keys(proxies);
    const ips = proxyIds.map((proxyId) => {
      const id = <number>(<unknown>proxyId);
      return proxies[id].getIp();
    });

    // test response ip's
    res.json({
      ip: ips?.[0],
    });
  }
}
