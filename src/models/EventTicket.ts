import { model, models, Schema } from 'mongoose';

const EventTicketSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'events', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ticketType: { type: String, required: true },
  noOfTickets: { type: Number, required: true },
  price: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now },
  participating: { type: String, default: 'false' },
  status: {
    type: String,
    default: 'Registered',
    enum: ['Attended', 'Registered', 'Cancelled', 'Pending'],
  },
});

export default models.eventTicket || model('eventTicket', EventTicketSchema);
