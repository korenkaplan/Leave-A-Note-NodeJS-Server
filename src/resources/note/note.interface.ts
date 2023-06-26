import { Document } from 'mongoose';

export default interface INote extends Document {
  damaged_user_id: string;
  hitting_user_car: string;
  hitting_user_phone: string;
  hitting_user_name: string;
  imageSource: string;
}
