import mongoose, { Document, Schema, Model } from 'mongoose';
import Event from './event.model';

/**
 * Interface for Booking document in MongoDB.
 * Extends Document for Mongoose typing support.
 */
interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Email validation regex pattern
const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Booking schema definition
const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      validate: [
        {
          validator: (v: string) => EMAIL_REGEX.test(v),
          message: 'Invalid email format',
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook to verify that the referenced event exists.
 * Throws an error if the eventId does not correspond to an existing Event.
 */
BookingSchema.pre<IBooking>('save', async function (next) {
  // Only validate eventId if it's modified
  if (this.isModified('eventId')) {
    try {
      const event = await Event.findById(this.eventId);
      if (!event) {
        throw new Error(
          `Event with ID ${this.eventId} does not exist. Cannot create booking.`
        );
      }
    } catch (error) {
      next(error instanceof Error ? error : new Error('Validation failed'));
      return;
    }
  }

  next();
});

// Index on eventId for faster queries
BookingSchema.index({ eventId: 1 });

// Export the Booking model
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
