import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import User from '@/resources/user/user.interface';
import accidentModel from '../accident/accident.model';
import { IAccident } from '../accident/accident.interface';
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
    //date: { type: Date, required: true },
    isDeleted: { type: Boolean , default: false },
  },
  { timestamps:{createdAt:true,updatedAt:false} }, // Merge options into a single object
);
const UserSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    carNumber: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    accidents: [AccidentSchema], // Array of embedded Accident objects
    unreadMessages: [AccidentSchema], // Array of embedded Accident objects in inbox
  },
  { collection: 'users',timestamps:{createdAt:true,updatedAt:false} }
);

/**
 * Hash the new password when updating a password  to the user
 */
UserSchema.pre<User>('save', async function (next) {
  if (!this.isModified('password')) { next(); }
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});


/**
 * Hash the input and then compare it to the hashed password in the database.
 */
UserSchema.methods.isValidPassword = async function (password: string): Promise<Error | boolean> {
  return await bcrypt.compare(password, this.password);
};

export default model<User>('User', UserSchema);
