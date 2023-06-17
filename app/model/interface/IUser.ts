import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  userName: string;
  userType: 'CUSTOMER' | 'ADMIN' | 'AGENT';
}
