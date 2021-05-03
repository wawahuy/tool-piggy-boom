import { Request, Response } from "express";
import _ from "lodash";
import configs from "../../../configs/game";
import { wsProxyManager } from "../../../realtimes/proxy";

export default class ProxyController {
  static async bestProxy(req: Request, res: Response) {
    const proxies = wsProxyManager.getClients();
    const proxyIds = Object.keys(proxies);
    const datas = proxyIds.map((proxyId) => {
      const id = <number>(<unknown>proxyId);
      const proxy = proxies[id];
      return {
        ip: proxy.getIp(),
        bandwidthPerMinute: proxy.getBandwidthAllPerMinute()
      }
    });

    // find best proxy
    // priority hight: min bandwdith
    const minBandwidth = _.maxBy(datas, o => o.bandwidthPerMinute);

    // split host & port
    const sp = minBandwidth?.ip?.split(':');

    // test response ip's
    res.json({
      ip: sp?.[0],
      port: Number(sp?.[1]),
      package: configs.package,
    });
  }
}
