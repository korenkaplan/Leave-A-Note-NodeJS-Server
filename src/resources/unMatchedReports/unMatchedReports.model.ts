import { Schema, model } from 'mongoose';
import IUnMatchedReports from '@/resources/unMatchedReports/unMatchedReports.interface';
import AccidentModel from '@/resources/accident/accident.model';
import {IAccident, IAccidentDoc} from '../accident/accident.interface';
const UnMatchedReportsSchema = new Schema<IUnMatchedReports>(
  {
    accident: {type: Object, required: true},
    damagedCarNumber:{type: String, required: true},
  },
  { collection: 'unMatchedReports' } 
);

export default model<IUnMatchedReports>('UnMatchedReports', UnMatchedReportsSchema);
