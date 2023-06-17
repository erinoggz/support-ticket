import { Types } from 'mongoose';

export type ProcessTicketDto = {
  ticket: Types.ObjectId;
  text: string;
  status?: string;
};

export type CreateTicketDto = {
  issue: string;
};
