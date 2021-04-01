import * as _ from "lodash";
import EventEmitter from "events";
import { defaultData, defaultNetworkCounter, ETypeData, NetworkCountData, NetworkCounter, DataCount } from "../models/network_count_director";

export class NetworkCountDirector extends EventEmitter {
  private static _instance = new NetworkCountDirector();

  static getInstance() {
    return NetworkCountDirector._instance;
  }

  private datas: DataCount = _.cloneDeep(defaultData);
  private dataPerSecond: DataCount = _.cloneDeep(defaultData);
  private dataPerMinute: DataCount = _.cloneDeep(defaultData);
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

  getAll(): NetworkCountData {
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

    this.emit('request', {
      type,
      count: data.countRequest,
      bandwidth: data.bandwidthRequest 
    });
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

    this.emit('response', {
      type,
      count: data.countResponse,
      bandwidth: data.bandwidthResponse 
    });
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
