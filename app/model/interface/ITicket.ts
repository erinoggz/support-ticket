import { Document, Types } from 'mongoose';

export interface ITicket extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  issue: string;
  responses: Array<Types.ObjectId>
  status: 'OPEN' | 'PROCESSING' | 'CLOSED'
}
