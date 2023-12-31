import { Document,Types } from 'mongoose';

export interface IAccidentDoc extends Document {
    hittingDriver: {
        name?: string;
        carNumber: string;
        phoneNumber?: string;
      };
      date: string;
      imageSource: string;
      type: 'report' | 'note';
      isAnonymous?: boolean;
      isIdentify?: boolean;
      reporter?: {
        name: string;
        phoneNumber: string;
      };
      isDeleted: boolean;
};
export interface IAccident  {
   _id?:Types.ObjectId
   hittingDriver: {
      name?: string;
      carNumber: string;
      phoneNumber?: string;
    };
   // date: Date;
    imageSource: string;
    type: 'report' | 'note';
    isAnonymous?: boolean;
    isIdentify?: boolean;
    reporter?: {
      name: string;
      phoneNumber: string;
    };
    isDeleted: boolean;
    date:string;
};