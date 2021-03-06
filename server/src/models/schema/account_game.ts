import moment from 'moment';
import Mongoose, { Document, Model, Schema } from 'mongoose';


/***
 * Declare Schema
 */
export interface IAccountGameDocument extends Document {
  uid: string;
  name: string;
  pwd: string;
  loginType: number,
  access_token: string,
  deviceToken: string,
  mac: string,
  deviceModel: string,
  mtkey: string;
  skey: string;
  syncDate?: Date | null;
  expiredDate?: Date | null;
}

export interface IAccountGameModal extends Model<IAccountGameDocument> {
  test(): void;
}

const AccountGameSchema = new Schema<IAccountGameDocument, IAccountGameModal>(
  {
    uid: { type: Schema.Types.String, required: true, index: true },
    name: { type: Schema.Types.String },
    pwd: { type: Schema.Types.String },
    loginType: { type: Schema.Types.Number },
    access_token: { type: Schema.Types.String },
    deviceToken: { type: Schema.Types.String },
    mac: { type: Schema.Types.String },
    deviceModel: { type: Schema.Types.String },
    mtkey: { type: Schema.Types.String },
    skey: { type: Schema.Types.String },
    syncDate: { type: Schema.Types.Date, index: true },
    expiredDate: { type: Schema.Types.Date, index: true },
  },
  { timestamps: true }
);

const ModelAccountGame = Mongoose.model<IAccountGameDocument, IAccountGameModal>(
  'account_game',
  AccountGameSchema
);

export default ModelAccountGame;
