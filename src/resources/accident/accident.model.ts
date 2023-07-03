import { Schema, model, Document } from 'mongoose';
import {IAccident} from '@/resources/accident/accident.interface';

const AccidentSchema = new Schema<IAccident>(
  {
    hittingDriver: {
      name: { type: String },
      carNumber: { type: String, required: true },
      phoneNumber: { type: String },
    },
    imageSource: { type: String, required: true },
    type: { type: String, enum: ['report', 'note'], required: true },
    isAnonymous: { type: Boolean },
    isIdentify: { type: Boolean },
    reporter: {
      name: { type: String },
      phoneNumber: { type: String },
    },
   // date: { type: Date, required: true },
    isDeleted: { type: Boolean , required: true },
  },
  { collection: 'accidents',timestamps:{createdAt:true,updatedAt:false} }, // Merge options into a single object
);

export default model<IAccident>('Accident', AccidentSchema);
