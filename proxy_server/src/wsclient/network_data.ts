import * as _ from "lodash";
import EventEmitter from "events";
import {
  defaultData,
  defaultNetworkCounter,
  ETypeData,
  NetworkData,
  NetworkCounter,
  DataCount,
  MaintanceData as MaintanceData,
} from "../models/network_data";

export class NetworkDataDirector extends EventEmitter {
  private static _instance: NetworkDataDirector;

  static getInstance() {
    if (!NetworkDataDirector._instance) {
      NetworkDataDirector._instance = new NetworkDataDirector;
    }
    return NetworkDataDirector._instance;
  }

  // network counter
  private net: DataCount = _.cloneDeep(defaultData);
  private netPerSecond: DataCount = _.cloneDeep(defaultData);
  private netPerMinute: DataCount = _.cloneDeep(defaultData);
  private netIntervalSecond: NodeJS.Timeout;
  private netIntervalMinute: NodeJS.Timeout;

  // config
  private timeLimitCommand: number = 0;
  private maintance: MaintanceData = {};

  // check data
  private hasTickSecond: boolean = false;
  private hasTickMinute: boolean = false;

  private constructor() {
    super();
    this.netIntervalSecond = setInterval(this.onSecond.bind(this), 1 * 1000);
    this.netIntervalMinute = setInterval(this.onMinute.bind(this), 60 * 1000);
  }

  disponse() {
    clearInterval(this.netIntervalSecond);
    clearInterval(this.netIntervalMinute);
  }

  getAll(): NetworkData {
    return {
      net: {
        total: this.net,
        second: this.netPerSecond,
        minute: this.netPerMinute,
      },
      maintance: this.maintance,
      timeLimitCommand: this.timeLimitCommand,
    };
  }

  getMaintaince() {
    return this.maintance;
  }

  setMaintance(data: MaintanceData) {
    this.maintance = data;
  }

  request(type: ETypeData, bandwidth: number = 0, counter: number = 1) {
    const data = this.net[type];
    const dataSecond = this.netPerSecond[type];
    const dataMinute = this.netPerMinute[type];

    data.bandwidthRequest += bandwidth;
    data.countRequest += counter;
    dataSecond.bandwidthRequest += bandwidth;
    dataSecond.countRequest += counter;
    dataMinute.bandwidthRequest += bandwidth;
    dataMinute.countRequest += counter;

    this.emit("request", {
      type,
      count: data.countRequest,
      bandwidth: data.bandwidthRequest,
    });
  }

  response(type: ETypeData, bandwidth: number = 0, counter: number = 1) {
    const data = this.net[type];
    const dataSecond = this.netPerSecond[type];
    const dataMinute = this.netPerMinute[type];

    data.bandwidthResponse += bandwidth;
    data.countResponse += counter;
    dataSecond.bandwidthResponse += bandwidth;
    dataSecond.countResponse += counter;
    dataMinute.bandwidthResponse += bandwidth;
    dataMinute.countResponse += counter;

    this.emit("response", {
      type,
      count: data.countResponse,
      bandwidth: data.bandwidthResponse,
    });
  }

  private onSecond() {
    const hasTickOld = this.hasTickSecond;
    this.hasTickSecond = this.hasDataCount(this.netPerSecond)
    if (this.hasTickSecond || hasTickOld) {
      this.emit("second", this.netPerSecond);
      this.netPerSecond = _.cloneDeep(defaultData);
    }
  }

  private onMinute() {
    const hasTickOld = this.hasTickMinute;
    this.hasTickMinute = this.hasDataCount(this.netPerMinute)
    if (this.hasTickMinute || hasTickOld) {
      this.emit("minute", this.netPerMinute);
      this.netPerMinute = _.cloneDeep(defaultData);
    }
  }

  private hasDataCount(data: DataCount) {
    return !!(
      this.hasNetworkCounter(data.http) ||
      this.hasNetworkCounter(data.https) ||
      this.hasNetworkCounter(data.ws)
    );
  }

  private hasNetworkCounter(data: NetworkCounter) {
    return !!(
      data.bandwidthRequest ||
      data.bandwidthResponse ||
      data.countRequest ||
      data.countResponse
    );
  }
}
