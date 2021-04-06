import { Request, Response } from 'express';
import moment from 'moment';
import appConfigs from "../../../configs/app"; 
import { EWsAdminGroup } from '../../../models/admin_ws';
import { EAdminCommandType } from '../../../realtimes/admin/command';
import { EWsCommandBase } from '../../../realtimes/command';

export default class ProxyManagerController {
  static homeView(req: Request, res: Response) {

    res.render("admin/proxy_manager/proxy_manager.view.ejs", {
      commandBase: {
        joinGroup: EWsCommandBase.JOIN_GROUP,
        leaveGroup: EWsCommandBase.LEAVE_GROUP,
      },
      groupProxyMgmt: EWsAdminGroup.PROXY_MGMT,
      commandAdmin: {
        proxyData: EAdminCommandType.PROXY_DATA,
        ping: EAdminCommandType.PING
      },
      socket: appConfigs.SOCKET
    });
  }
}