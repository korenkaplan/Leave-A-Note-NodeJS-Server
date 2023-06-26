import { Document } from 'mongoose';
import { IAccident } from '@/resources/accident/accident.interface';

export default interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  carNumber: string;
  phoneNumber: string;
  role: string;
  accidents: IAccident[]; // an array of Accident objects
  unreadMessages: IAccident[]; // an array of Accident objects in inbox

  isValidPassword(password: string): Promise<Error | boolean>;
}
