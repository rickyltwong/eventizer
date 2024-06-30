import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/config/connectDB';
import Event from '@/models/Event';
import mongoose from 'mongoose';



export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
    
    const { eventid } = req.query;

    await dbConnect();


    try {
        const deletedEvent = await Event.findByIdAndDelete(eventid);
        if (!deletedEvent) {
          return res.status(404).json({ success: false, message: 'Event not found' });
        }
        res.status(200).json({ success: true, message: 'Event deleted successfully' });
      } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to delete event' });
      }
}