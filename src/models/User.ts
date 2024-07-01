import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email?: string;
  password?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  profile?: {
    dateOfBirth?: Date;
    avatarUrl?: string;
    bio?: string;
  };
  preferences?: {
    language?: string;
    notificationSettings?: {
      emailNotifications?: boolean;
    };
  };
  eventsAttending?: mongoose.Types.ObjectId[];
  eventsHosting?: mongoose.Types.ObjectId[];
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ['attendee', 'organizer', 'admin'],
      default: 'attendee',
    },
    profile: {
      dateOfBirth: { type: Date },
      avatarUrl: { type: String },
      bio: { type: String },
    },
    preferences: {
      language: { type: String },
      notificationSettings: {
        emailNotifications: { type: Boolean },
      },
    },
    eventsAttending: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'events',
      },
    ],
    eventsHosting: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'events',
      },
    ],
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
