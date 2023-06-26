import { Schema, model,InferSchemaType } from 'mongoose';
import IReport from '@/resources/report/report.interface';

const ReportSchema = new Schema<IReport>(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    damagedCarNumber: {
      type: String,
      required: true,
    },
    hittingCarNumber: {
      type: String,
      required: true,
    },
    isAnonymous: {
      type: Boolean,
      required: true,
    },
    reporter: {
      name: {
        type: String,
        required: true,
      },
      carNumber: {
        type: String,
        required: true,
      },
    },
  },
);
export default model<IReport>('Report', ReportSchema);
