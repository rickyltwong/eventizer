import { Schema, model, models } from 'mongoose';
import { IEvent, IEventAddress } from '@/types/event';

// https://mongoosejs.com/docs/typescript.html

const EventAddressSchema = new Schema<IEventAddress>({
  venueName: { type: String, required: true },
  addressLine1: { type: String },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String },
  postalCode: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
});

const EventSchema = new Schema<IEvent>(
  {
    eventName: { type: String, required: true },
    eventDescription: { type: String, required: true },
    eventAddress: { type: EventAddressSchema, required: true },
    eventStartDateTime: { type: Date, required: true },
    eventEndDateTime: { type: Date, required: true },
    instructorName: { type: String, required: true },
    eventType: { type: String, required: true },
    capacity: { type: Number, required: true },
    remainingSeats: { type: Number },
    difficulty: { type: String, required: true },
    minimumAge: { type: Number },
  },
  { timestamps: true }
);

export default models.events || model('events', EventSchema);

// Ref: https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/models/Pet.ts
