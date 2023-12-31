import { Document,Types } from 'mongoose';
import {IAccident} from "@/resources/accident/accident.interface";
export default interface IUnMatchedReports extends Document {
    accident?: IAccident;
    damagedCarNumber?: string;
    accidentReference?:Types.ObjectId,
};
