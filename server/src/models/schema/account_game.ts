import Mongoose, { Document, Model, Schema } from 'mongoose';


/***
 * Declare Schema
 */
export interface IAccountGameDocument extends Document {
  uid: string;
  loginType: number,
  access_token: string,
  deviceToken: string,
  mac: string,
  deviceModel: string,
}

export interface IAccountGameModal extends Model<IAccountGameDocument> {
  test(): void;
}

const AccountGameSchema = new Schema<IAccountGameDocument, IAccountGameModal>(
  {
    uid: { type: Schema.Types.String, required: true, index: true },
    loginType: { type: Schema.Types.Number },
    access_token: { type: Schema.Types.String },
    deviceToken: { type: Schema.Types.String },
    mac: { type: Schema.Types.String },
    deviceModel: { type: Schema.Types.String },
  },
  { timestamps: true }
);

const ModelAccountGame = Mongoose.model<IAccountGameDocument, IAccountGameModal>(
  'account_game',
  AccountGameSchema
);

export default ModelAccountGame;
