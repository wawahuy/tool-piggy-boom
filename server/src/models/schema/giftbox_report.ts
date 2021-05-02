import Mongoose, { Document, Model, Schema } from 'mongoose';
import { RewardAdType } from '../../games/models/game_req/reward';

/***
 * Declare Schema
 */
export interface IGiftboxReportDocument extends Document {
  uid: string,
  type?: RewardAdType;
  rewardCount: number;
}

export interface IGiftboxReportModal extends Model<IGiftboxReportDocument> {
  test(): void;
}

const GiftboxSchema = new Schema<IGiftboxReportDocument, IGiftboxReportModal>(
  {
    uid: { type: Schema.Types.String, index: true },
    type: { type: Schema.Types.String, index: true },
    rewardCount: { type: Schema.Types.Number, default: 0 },
  },
  { timestamps: true,  }
);

GiftboxSchema.index({ uid: 1, type: 1 });

const ModelGiftboxReport = Mongoose.model<IGiftboxReportDocument, IGiftboxReportModal>(
  'giftbox_report',
  GiftboxSchema
);

export default ModelGiftboxReport;