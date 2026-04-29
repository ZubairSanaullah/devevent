import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';

/**
 * GET /api/events/[slug]
 * Fetches event details by its unique slug.
 * 
 * @param request - The incoming NextRequest object.
 * @param context - Route context containing params promise.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // 1. Establish database connection
    await connectDB();

    // 2. Await the dynamic parameters (Next.js 15+ requirement)
    const { slug } = await params;

    // 3. Robust slug validation
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { message: 'Invalid or missing event slug' },
        { status: 400 }
      );
    }

    // 4. Query the database for the matching event
    // Using lean() for better performance as we only need the data
    const event = await Event.findOne({ slug }).lean();

    // 5. Handle case where event is not found
    if (!event) {
      return NextResponse.json(
        { message: `Event with slug '${slug}' not found` },
        { status: 404 }
      );
    }

    // 6. Return successful response
    return NextResponse.json(
      { 
        message: 'Event details fetched successfully', 
        event 
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    // 7. Comprehensive error logging and response
    console.error(`[GET /api/events/[slug]] Error:`, error);

    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return NextResponse.json(
      { 
        message: 'Failed to fetch event details', 
        error: errorMessage 
      },
      { status: 500 }
    );
  }
}
