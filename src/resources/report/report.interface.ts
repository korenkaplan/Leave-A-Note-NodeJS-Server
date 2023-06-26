import { Document } from 'mongoose';

export default interface IReport extends Document {
    imageUrl: string;
    damagedCarNumber:string;
    hittingCarNumber: string;
    isAnonymous: boolean;
    
    reporter:{
        name:string;
        phoneNumber:string;
    }
};
