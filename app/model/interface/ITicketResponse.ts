import { Document, Types } from 'mongoose';

export interface ITicketResponse extends Document {
  _id: Types.ObjectId;
  ticket: Types.ObjectId;
  user: Types.ObjectId;
  text: string
}
