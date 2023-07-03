import { Schema, model } from 'mongoose';
import IUnMatchedReports from '@/resources/unMatchedReports/unMatchedReports.interface';
import { AccidentSchema } from '../accident/accident.model';
const UnMatchedReportsSchema = new Schema<IUnMatchedReports>(
  {
    accident: {type: AccidentSchema, required: true},
    damagedCarNumber:{type: String, required: true},
  },
  { collection: 'unMatchedReports' } 
);

export default model<IUnMatchedReports>('UnMatchedReports', UnMatchedReportsSchema);
