'use server'

import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";

export const getEventBySlug = async (slug: string) => {
    try {
        await connectDB();
        return await Event.findOne({ slug }).lean();
    } catch (error) {
        console.error('Error fetching event by slug:', error);
        return null;
    }
}

export const getSimilarEventsBySlug = async (slug: string) => {
    try{
        await connectDB();
        const event = await Event.findOne({slug});
        if (!event) return [];

        return await Event.find({_id: {$ne: event._id}, tags: {$in: event.tags}}).lean();
    } catch (_error) {
        return [];
    }
}