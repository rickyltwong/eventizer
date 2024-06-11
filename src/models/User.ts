import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId; 

const userSchema = new Schema({
  _id: {
    type: ObjectId,
    default: new mongoose.Types.ObjectId(), 
  },
  username: {
    type: String,
    unique: true,
  },
  role: {
    type: String,
  },
  profile: {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    phone: {
      type: String,
    },
    avatarUrl: {
      type: String,
    },
    bio: {
      type: String,
    },
  },
  preferences: {
    language: {
      type: String,
    },
    notificationSettings: {
      emailNotifications: {
        type: Boolean,
      },
    },
  },
  eventsAttending: [
    {
      type: ObjectId,
      ref: 'events', 
    },
  ],
  eventsHosting: [
    {
      type: ObjectId,
      ref: 'events', 
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
  },
}, {
  timestamps: true, 
});

const User =  mongoose.models.User || mongoose.model('User', userSchema);

export default User;
