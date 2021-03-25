import { Request, Response } from "express";
import moment from "moment";
import { getClassLogLevel, LogItem } from "../../../models/log";
import ModelLog, { ILogDocument } from "../../../models/schema/log";

export default class LoggerController {
  static async loggerView(req: Request, res: Response) {
    const list = await ModelLog.aggregate([
      {
        $sort: {
          timestamp: -1,
        },
      },
    ]).catch((e) => []);

    res.render("admin/logger/logger.view.ejs", {
      list: LoggerController.mapDataLogger(list),
    });
  }

  private static mapDataLogger(list: ILogDocument[]): LogItem[] {
    return list?.map((r) => {
      let message = r.message || '';
      let name = message.split('\n')[0];
      return {
        name,
        message: message,
        level: r.level,
        type: getClassLogLevel(r.level),
        timestamp: moment(r.timestamp).format("YYYY/MM/DD hh:mm:ss"),
      } as LogItem;
    });
  }
}
