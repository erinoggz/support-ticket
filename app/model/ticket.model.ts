import { model, Schema } from 'mongoose';
import { ITicket } from './interface/ITicket';

// Create the ticket schema
const TicketSchema = new Schema<ITicket>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
    status: {
      type: String,
      required: true,
      enum: ['OPEN', 'PROCESSING', 'CLOSED'],
      default: 'OPEN',
    },
    responses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'TicketResponses',
      },
    ],
    issue: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

// Create and export ticket model
const Ticket = model<ITicket>('Tickets', TicketSchema);

export default Ticket;
