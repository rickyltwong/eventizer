

import mongoose from 'mongoose';

const eventAddressSchema = new mongoose.Schema({
  venueName: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  country: String,
  postalCode: String,
  latitude: Number,
  longitude: Number
});

const eventSchema = new mongoose.Schema({
  eventName: String,
  eventDescription: String,
  eventAddress: eventAddressSchema,
  eventStartDateTime: Date,
  eventEndDateTime: Date,
  instructorName: String,
  eventType: String,
  capacity: Number,
  remainingSeats: Number,
  difficulty: String,
  minimumAge: Number
},{ collection: 'events' }); 



const MyEvent = mongoose.models.events || mongoose.model('events', eventSchema);

export default MyEvent
