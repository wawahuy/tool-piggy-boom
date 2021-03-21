import moment from 'moment';
import Mongoose, { Document, FilterQuery, Model, Schema } from 'mongoose';

/***
 * Declare Schema
 */
export interface IIPProxyDocument extends Document {
  ipAddress: string;
  port: number;
}


export interface IIProxyModal extends Model<IIPProxyDocument> {
}

const IPProxySchema = new Schema<IIPProxyDocument, IIProxyModal>(
  {
    ipAddress: { type: Schema.Types.String, index: true },
    port: { type: Schema.Types.Number },
  },
  { timestamps: true }
);

const ModelIPProxy = Mongoose.model<IIPProxyDocument, IIProxyModal>(
  'ip_proxy',
  IPProxySchema
);


export default ModelIPProxy;