import { Request, Response } from "express";
import * as core from "express-serve-static-core";
import moment from "moment";
import { getClassLogLevel, LogItem } from "../../../models/log";
import ModelLog, { ILogDocument } from "../../../models/schema/log";
import appConfigs from "../../../configs/app";
import { LoggerQuery, pageSize } from "./model";

export default class LoggerController {
  static async loggerView(
    req: Request<core.ParamsDictionary, any, any, any>,
    res: Response
  ) {
    let {
      date_from,
      date_to = moment().utcOffset(appConfigs.UTC_OFFSET).format("YYYY/MM/DD"),
      page = 1,
      limit = 100,
    } = <LoggerQuery>req.query;


    // convert user time to utc0 time
    let timestamp: Object = {
      $lte: moment(date_to, "YYYY/MM/DD")
        .utcOffset(appConfigs.UTC_OFFSET)
        .add(24 * 60 * 60 - 1, 'seconds')
        .toDate(),
    };

    if (date_from) {
      timestamp = {
        ...timestamp,
        $gte: moment(date_from, "YYYY/MM/DD")
          .utcOffset(appConfigs.UTC_OFFSET)
          .toDate(),
      };
    }

    const aggregate = [
      {
        $match: {
          timestamp: timestamp,
        },
      },
      {
        $sort: {
          timestamp: -1,
        },
      },
      {
        $skip: Number(limit) * (Number(page) - 1),
      },
      {
        $limit: Number(limit),
      },
    ];

    const list = await ModelLog.aggregate(aggregate).catch((e) => []);

    res.render("admin/logger/logger.view.ejs", {
      list: LoggerController.mapDataLogger(list),
      filter: {
        date_from,
        date_to: date_to || moment().format("YYYY/MM/DD"),
        page,
        limit,
      },
      page_size: pageSize,
    });
  }

  private static mapDataLogger(list: ILogDocument[]): LogItem[] {
    return list?.map((r) => {
      let message = r.message || "";
      let name = message.split("\n")[0];
      return {
        name,
        message: message,
        level: r.level,
        type: getClassLogLevel(r.level),
        timestamp: moment(r.timestamp)
          .utcOffset(appConfigs.UTC_OFFSET)
          .format("YYYY/MM/DD hh:mm:ss"),
      } as LogItem;
    });
  }
}
