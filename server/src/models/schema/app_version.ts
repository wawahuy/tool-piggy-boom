import Mongoose, { Document, Model, Schema } from 'mongoose';

/***
 * Declare Schema
 */
export interface IAppVersionDocument extends Document {
  _id?: string;
  version?: string;
  link?: string;
  detail?: string;
}

export interface IAppVersionModal extends Model<IAppVersionDocument> {
  test(): void;
}

const AppVersionSchema = new Schema<IAppVersionDocument, IAppVersionModal>(
  {
    version: { type: Schema.Types.String },
    link: { type: Schema.Types.String },
    detail: { type: Schema.Types.String },
  },
  { timestamps: true }
);

const ModelAppVersion = Mongoose.model<IAppVersionDocument, IAppVersionModal>(
  'app_version',
  AppVersionSchema
);

export default ModelAppVersion;