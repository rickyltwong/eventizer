import { Document, Schema, model, models } from 'mongoose';

export interface IEventAddress extends Document {
  venueName: string;
  addressLine1?: string;
  addressLine2?: string;
  city: string;
  state: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface IEvent extends Document {
  eventName: string;
  eventDescription: string;
  eventAddress: IEventAddress;
  eventStartDateTime: Date;
  eventEndDateTime: Date;
  instructorName: string;
  eventType: string;
  capacity: number;
  remainingSeats: number;
  difficulty: string;
  minimumAge: number;
}

export const EventAddressSchema = new Schema<IEventAddress>({
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

export const EventSchema = new Schema<IEvent>(
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

const Event = models.events || model('events', EventSchema);

export default Event;

// Ref: https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/models/Pet.ts
