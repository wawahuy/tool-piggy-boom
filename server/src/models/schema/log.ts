import Mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { ELogLevel } from '../log';

/***
 * Declare Schema
 */
export interface ILogDocument extends Document {
  _id?: string;
  level?: ELogLevel;
  message?: string;
  meta?: any;
  timestamp?: Date;
}

export interface ILogModal extends Model<ILogDocument> {
  test(): void;
}

const LogSchema = new Schema<ILogDocument, ILogModal>(
  {
    level: { type: Schema.Types.String },
    message: { type: Schema.Types.String },
    meta: { type: Schema.Types.Mixed },
    timestamp: { type: Schema.Types.Date },
  },
  { timestamps: false }
);

const ModelLog = Mongoose.model<ILogDocument, ILogModal>(
  'log',
  LogSchema
);

export default ModelLog;