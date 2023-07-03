import { Schema, model } from 'mongoose';
import IUnMatchedReports from '@/resources/unMatchedReports/unMatchedReports.interface';
import { AccidentSchema } from '../accident/accident.model';
const UnMatchedReportsSchema = new Schema<IUnMatchedReports>(
  {
    accident: {type: AccidentSchema},
    damagedCarNumber:{type: String},
    accidentReference:{ type: Schema.Types.ObjectId,
       ref: 'Accident', // Referencing the 'Accident' model
    },
  },
  { collection: 'unMatchedReports', timestamps:true} 
  
);

export default model<IUnMatchedReports>('UnMatchedReports', UnMatchedReportsSchema);
