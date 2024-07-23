import mongoose, { Model, Schema } from 'mongoose';

import { IEvent, IEventAddress } from '@/types';

// https://mongoosejs.com/docs/typescript.html

const EventAddressSchema = new Schema<IEventAddress>({
  venueName: { type: String, required: true },
  addressLine1: { type: String },
  addressLine2: { type: String, required: false },
  city: { type: String, required: false },
  state: { type: String, required: false },
  country: { type: String },
  postalCode: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
});

const EventSchema = new Schema<IEvent>(
  {
    eventName: { type: String, required: true },
    eventDescription: { type: String, required: true },
    eventAddress: { type: EventAddressSchema },
    eventStartDateTime: { type: Date, required: true },
    eventEndDateTime: { type: Date, required: true },
    instructorName: { type: String, required: true },
    eventType: { type: String, required: true },
    capacity: { type: Number, required: true },
    difficulty: { type: String, required: true },
    minimumAge: { type: Number },
    image: { type: String, required: false },
  },
  { timestamps: true },
);

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model('Event', EventSchema);

export default Event;

// Ref: https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/models/Pet.ts
