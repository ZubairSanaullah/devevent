import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';
import { v2 as cloudinary } from 'cloudinary';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        let event;

        try {
            event = Object.fromEntries(formData.entries());
        } catch (_e) {
            return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
        }

        const file = formData.get('image') as File;

        if(!file) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        // Parse tags and agenda safely
        let tags: string[] = [];
        let agenda: string[] = [];

        try {
            const tagsData = formData.get('tags');
            console.log('Raw tags data:', tagsData, typeof tagsData);
            if (tagsData) {
                const tagsStr = typeof tagsData === 'string' ? tagsData : String(tagsData);
                tags = JSON.parse(tagsStr);
                if (!Array.isArray(tags)) tags = [];
            }
        } catch (_e) {
            console.warn('Failed to parse tags:', _e);
            tags = [];
        }

        try {
            const agendaData = formData.get('agenda');
            console.log('Raw agenda data:', agendaData, typeof agendaData);
            if (agendaData) {
                const agendaStr = typeof agendaData === 'string' ? agendaData : String(agendaData);
                agenda = JSON.parse(agendaStr);
                if (!Array.isArray(agenda)) agenda = [];
            }
        } catch (_e) {
            console.warn('Failed to parse agenda:', _e);
            agenda = [];
        }

        // Validate that required arrays are not empty
        if (tags.length === 0) {
            return NextResponse.json({ error: 'At least one tag is required' }, { status: 400 });
        }

        if (agenda.length === 0) {
            return NextResponse.json({ error: 'At least one agenda item is required' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                resource_type: 'image',
                folder: 'DevEvent'
            }, (error, result) => {
                if(error) return reject(error);

                resolve(result);
            }).end(buffer);
        })

        event.image = (uploadResult as {secure_url: string}).secure_url;

        const createdEvent = await Event.create({
            ...event,
            tags: tags,
            agenda: agenda,
        });

        return NextResponse.json({ message: 'Event Created Successfully', event: createdEvent }, { status: 201 });
    } catch (error) {
        console.error('Event creation error:', error);
        
        // Handle Mongoose validation errors
        if (error instanceof Error && 'errors' in (error as unknown as Record<string, unknown>)) {
            const validationErrors = (error as unknown as { errors: Record<string, { message: string }> }).errors;
            const errorMessages = Object.values(validationErrors)
                .map((err) => err.message)
                .join(', ');
            return NextResponse.json({ message: 'Event Creation Failed', error: errorMessages }, { status: 400 });
        }
        
        return NextResponse.json({message: 'Event Creation Failed', error: error instanceof Error ? error.message : 'Unknown error'}, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();

        const events = await Event.find().sort({createdAt: -1});

        return NextResponse.json({message: 'Events fetched successfully', events}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: 'Failed to fetch events', error: error instanceof Error ? error.message : 'Unknown error'}, {status: 500})
    }
}