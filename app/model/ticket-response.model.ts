import { model, Schema } from 'mongoose';
import { ITicketResponse } from './interface/ITicketResponse';

// Create the ticket response schema
const TicketResponseSchema = new Schema<ITicketResponse>(
  {
    ticket: {
      type: Schema.Types.ObjectId,
      ref: 'Tickets',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
    text: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

// Create and export ticket response model
const TicketResponse = model<ITicketResponse>(
  'TicketResponses',
  TicketResponseSchema
);

export default TicketResponse;
