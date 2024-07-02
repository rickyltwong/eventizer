import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email?: string;
  password?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  eventHistory?: mongoose.Types.ObjectId[];
  favourites?: mongoose.Types.ObjectId[];
  authentication: {
    provider: string;
    providerId?: string;
    googleId?: string;
  };
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: {
      type: String,
      required: true,
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
    authentication: {
      provider: { type: String, required: true },
      providerId: { type: String },
      googleId: { type: String },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status: { type: String, default: 'active' },
  },
  {
    timestamps: true,
  },
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
