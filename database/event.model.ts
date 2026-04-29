import mongoose, { Document, Schema, Model } from 'mongoose';

/**
 * Interface for Event document in MongoDB.
 * Extends Document for Mongoose typing support.
 */
interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Event schema definition
const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      enum: ['online', 'offline', 'hybrid'],
      required: [true, 'Mode is required'],
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'Agenda must contain at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'Tags must contain at least one item',
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook to:
 * 1. Generate URL-friendly slug from title (only if title changed)
 * 2. Normalize date to ISO format
 * 3. Validate and format time consistently
 */
EventSchema.pre<IEvent>('save', function (next) {
  // Only regenerate slug if title has changed or is new
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  }

  // Normalize date to ISO format (YYYY-MM-DD)
  if (this.isModified('date') && this.date) {
    const dateObj = new Date(this.date);
    if (!isNaN(dateObj.getTime())) {
      this.date = dateObj.toISOString().split('T')[0];
    }
  }

  // Normalize time to HH:MM format
  if (this.isModified('time') && this.time) {
    const timeMatch = this.time.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      const hours = String(parseInt(timeMatch[1], 10)).padStart(2, '0');
      const minutes = timeMatch[2];
      this.time = `${hours}:${minutes}`;
    }
  }

  next();
});

// Ensure slug is unique and indexed
EventSchema.index({ slug: 1 }, { unique: true });

// Export the Event model
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
