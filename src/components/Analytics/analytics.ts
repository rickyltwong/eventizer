import mongoose, { Document, Schema } from 'mongoose';

import connectDB from '@/lib/connectDB';

interface VisitorDocument extends Document {
  date: Date;
  count: number;
}

const VisitorSchema = new Schema({
  date: { type: Date, required: true },
  count: { type: Number, default: 0 },
});

const VisitorModel = mongoose.model<VisitorDocument>('Visitor', VisitorSchema);

export class Analytics {
  constructor() {
    connectDB();
  }

  async trackVisitor() {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    try {
      await VisitorModel.findOneAndUpdate(
        { date: formattedDate },
        { $inc: { count: 1 } },
        { upsert: true },
      );
    } catch (error) {
      console.error('Error tracking visitor:', error);
    }
  }

  async getVisitorCount(date: string) {
    try {
      const res = await VisitorModel.findOne({ date });
      return res?.count ?? 0;
    } catch (error) {
      console.error('Error retrieving visitor count:', error);
      return 0;
    }
  }

  async getVisitorsLast7Days() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const promises: Promise<any>[] = []; // FIXME: Unexpected any. Specify a different type
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      const promise = this.getVisitorCount(formattedDate);
      promises.push(promise);
    }

    try {
      const visitorCounts = await Promise.all(promises);
      return visitorCounts.reverse(); // Reverse to show most recent day first
    } catch (error) {
      console.error('Error retrieving visitor counts for last 7 days:', error);
      return [];
    }
  }
}

const analytics = new Analytics();
export default analytics;
