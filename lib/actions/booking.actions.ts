'use server';

import Booking from "@/database/booking.model";
import connectDB from "@/lib/mongodb";

export const createBooking = async ({eventId, slug: _slug, email}: {eventId: string; slug: string; email: string}) => {
    try {
        await connectDB();

        await Booking.create({eventId, email});

        return {success: true};
    } catch (error) {
        console.error('Create booking failed', error);
        return {success: false};
    }
}