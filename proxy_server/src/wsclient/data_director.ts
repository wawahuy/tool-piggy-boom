import * as _ from "lodash";
import EventEmitter from "events";
import { defaultData, defaultNetworkCounter, ETypeData, IDataAll, NetworkCounter, TypeData } from "../models/data_director";


export class DataDirector extends EventEmitter {
  private static _instance = new DataDirector();

  static getInstance() {
    return DataDirector._instance;
  }

  private datas: TypeData = _.cloneDeep(defaultData);
  private dataPerSecond: TypeData = _.cloneDeep(defaultData);
  private dataPerMinute: TypeData = _.cloneDeep(defaultData);
  private intervalSecond: NodeJS.Timeout;
  private intervalMinute: NodeJS.Timeout;

  private constructor() {
    super();
    this.intervalSecond = setInterval(this.onSecond.bind(this), 1000);
    this.intervalMinute = setInterval(this.onMinute.bind(this), 60 * 1000);
  }

  disponse() {
    clearInterval(this.intervalSecond);
    clearInterval(this.intervalMinute);
  }

  getAll(): IDataAll {
    return {
      total: this.datas,
      second: this.dataPerSecond,
      minute: this.dataPerMinute
    }
  }

  request(type: ETypeData, bandwidth: number = 0) {
    const data = this.datas[type];
    const dataSecond = this.dataPerSecond[type];
    const dataMinute = this.dataPerMinute[type];

    data.bandwidthRequest += bandwidth;
    data.countRequest++;
    dataSecond.countRequest++;
    dataSecond.bandwidthRequest += bandwidth;
    dataMinute.countRequest++;
    dataMinute.bandwidthRequest += bandwidth;
  }

  response(type: ETypeData, bandwidth: number = 0) {
    const data = this.datas[type];
    const dataSecond = this.dataPerSecond[type];
    const dataMinute = this.dataPerMinute[type];

    data.bandwidthResponse += bandwidth;
    data.countResponse++;
    dataSecond.countResponse++;
    dataSecond.bandwidthResponse += bandwidth;
    dataMinute.countResponse++;
    dataMinute.bandwidthResponse += bandwidth;
  }

  private onSecond() {
    this.emit('second', this.dataPerSecond);
    this.dataPerSecond = _.cloneDeep(defaultData);
  }

  private onMinute() {
    this.emit('minute', this.dataPerMinute);
    this.dataPerMinute = _.cloneDeep(defaultData);
  }
}
