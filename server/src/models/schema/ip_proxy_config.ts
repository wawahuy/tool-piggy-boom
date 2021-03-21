import moment from 'moment';
import Mongoose, { Document, FilterQuery, Model, Schema } from 'mongoose';

/***
 * Declare Schema
 */
export interface IIPProxyConfigDocument extends Document {
  syncDate: Date | null
}

export interface IIProxyConfigModal extends Model<IIPProxyConfigDocument> {
  canSync(): Promise<boolean>;
}

const IPProxyConfigSchema = new Schema<IIPProxyConfigDocument, IIProxyConfigModal>(
  {
    syncDate: { type: Schema.Types.Date, index: true },
  },
  { timestamps: true }
);

IPProxyConfigSchema.statics.canSync = async function () {
  const model = await ModelIPProxyConfig.findOne({}).catch(err => null);
  if (model && model.syncDate) {
    const second = moment().diff(model.syncDate, 'seconds');
    if (second < 24 * 60 * 60) {
      return false;
    }
  }

  return true;
}

const ModelIPProxyConfig = Mongoose.model<IIPProxyConfigDocument, IIProxyConfigModal>(
  'ip_proxy_config',
  IPProxyConfigSchema
);


export default ModelIPProxyConfig;