import { Request, Response } from 'express';
import moment from 'moment';
import { join } from 'path';
import fs from 'fs';
import configs from '../../../configs/app';
import appConfigs from "../../../configs/app"; 
import { EWsAdminGroup } from '../../../models/admin_ws';
import { EAdminCommandType } from '../../../realtimes/admin/command';
import { EWsCommandBase } from '../../../realtimes/command';

export default class DownloadController {
  static download(req: Request, res: Response) {
    const {filename} = req.params;
    const pathfile = join(configs.UPLOAD_DIR, filename.replace(/\.\.\//g, ''));
    if (fs.existsSync(pathfile) && fs.statSync(pathfile).isFile()) {
      fs.createReadStream(pathfile).pipe(res).on('error', (e) => {
        res.status(500).send('Download failed!');
      });
    }
  }
}