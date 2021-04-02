import { DataCountFrame, DataCount } from "../models/network_data";

declare module '../wsclient/network_data' {
  interface NetworkCountDirector {
    on(event: 'second', listener: (data: DataCount) => void): this;
    on(event: 'minute', listener: (data: DataCount) => void): this;
    on(event: 'request', listener: (data: DataCountFrame) => void): this;
    on(event: 'response', listener: (data: DataCountFrame) => void): this;

    emit(event: 'second', data: DataCount): boolean;
    emit(event: 'minute', data: DataCount): boolean;
    emit(event: 'request', data: DataCountFrame): boolean;
    emit(event: 'response', data: DataCountFrame): boolean;
  }
}