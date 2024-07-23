import mongoose, { Model, Schema } from 'mongoose';

import type { IUser } from '@/types';

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    _id: { type: mongoose.Schema.Types.ObjectId },
    password: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    role: {
      type: String,
      enum: ['attendee', 'admin'],
      default: 'attendee',
    },
    name: { type: String },
    image: { type: String },
    eventHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'events',
      },
    ],
    favourites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'events',
      },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status: { type: String, default: 'active' },
    accountSource: { type: String },
  },
  {
    timestamps: true,
  },
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
