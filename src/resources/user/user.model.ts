import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import User from '@/resources/user/user.interface';
import { AccidentSchema } from '../accident/accident.model';
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
    deviceToken:{
      type: String,
      required: true,
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
