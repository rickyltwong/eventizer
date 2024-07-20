import { model, models, Schema } from 'mongoose';

const UserFavoriteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  },
  {
    timestamps: true,
  },
);

export default models.userFavorite || model('userFavorite', UserFavoriteSchema);
