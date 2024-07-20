import { model, models, Schema } from 'mongoose';

const TicketSchema = new Schema({
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    type: {
      type: String,
      required: true
    },
    markedPrice: {
      type: Number,
      
    },
    price: {
      type: Number,
      
    },
    discount: {
      type: Number,
      default: 0
    },
    discountExpiry: {
      type: Date
    },
    status: {
      type: String,
      enum: ['Pending', 'Pre-Sale', 'Available', 'Sold', 'Cancelled'],
      default: 'Pending'
    },
    sold: {
      type: Number,
      default: 0
    }
  });

  export default models.tickets || model('tickets', TicketSchema);
