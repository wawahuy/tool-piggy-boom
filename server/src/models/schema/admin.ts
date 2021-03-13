import Mongoose, { Document, Model, Schema } from 'mongoose';

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

AdminSchema.methods.comparePassword = (password: string) => {
  
  return true;
}

const ModelAdmin = Mongoose.model<IAdminDocument, IAdminModal>(
  'admin',
  AdminSchema
);

export default ModelAdmin;
