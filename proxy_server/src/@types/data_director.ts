import { TypeData } from "../models/data_director";

declare module '../wsclient/data_director' {
  interface DataDirector {
    on(event: 'second', listener: (data: TypeData) => void): this;
    on(event: 'minute', listener: (data: TypeData) => void): this;
  }
}