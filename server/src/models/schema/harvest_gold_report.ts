import Mongoose, { Document, Model, Schema } from 'mongoose';

/***
 * Declare Schema
 */
export interface IHarvestGoldReportDocument extends Document {
  uid: string,
  rewardCount: number;
}

export interface IHavestGoldReportModal extends Model<IHarvestGoldReportDocument> {
  test(): void;
}

const HarvestGoldSchema = new Schema<IHarvestGoldReportDocument, IHavestGoldReportModal>(
  {
    uid: { type: Schema.Types.String, index: true },
    rewardCount: { type: Schema.Types.Number, default: 0 },
  },
  { timestamps: true,  }
);

const ModelHarvestGoldReport = Mongoose.model<IHarvestGoldReportDocument, IHavestGoldReportModal>(
  'harvest_gold_report',
  HarvestGoldSchema
);

export default ModelHarvestGoldReport;