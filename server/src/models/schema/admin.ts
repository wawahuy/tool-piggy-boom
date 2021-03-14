import Mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

/***
 * Declare Schema
 */
export interface IAdminDocument extends Document {
  _id?: string;
  username?: string;
  password?: string;
  isAdmin?: boolean;
  comparePassword?: (password: string) => boolean;
}

export interface IAdminModal extends Model<IAdminDocument> {
  test(): void;
}

const AdminSchema = new Schema<IAdminDocument, IAdminModal>(
  {
    username: { type: Schema.Types.String },
    password: { type: Schema.Types.String },
    isAdmin: { type: Schema.Types.Boolean, default: true },
  },
  { timestamps: true }
);

AdminSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, <string>this.password);
}

const ModelAdmin = Mongoose.model<IAdminDocument, IAdminModal>(
  'admin',
  AdminSchema
);

export default ModelAdmin;