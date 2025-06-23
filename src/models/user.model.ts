import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: {
 type: String,
 required: true,
 unique: true },

  password: { 
  type: String,
   required: true, 
   select: false },

  role: { 
  type: String,
  enum: ['user', 'admin'],
  default: 'user',
  required: true
},
 createdAt: { type: Date, default: Date.now },
 updatedAt: { type: Date, default: Date.now }
});


const User = mongoose.model<IUser>('User', userSchema);
export default User;
