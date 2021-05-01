import { Request, Response } from "express";
import configs from "../../../configs/game";
import { wsProxyManager } from "../../../realtimes/proxy";

export default class ProxyController {
  static async bestProxy(req: Request, res: Response) {
    const proxies = wsProxyManager.getClients();
    const proxyIds = Object.keys(proxies);
    const ips = proxyIds.map((proxyId) => {
      const id = <number>(<unknown>proxyId);
      return proxies[id].getIp();
    });

    // split host & port
    const sp = ips?.[0]?.split(':');

    // test response ip's
    res.json({
      ip: sp?.[0],
      port: Number(sp?.[1]),
      package: configs.package,
    });
  }
}
