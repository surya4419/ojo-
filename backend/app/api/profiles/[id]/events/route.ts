import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { Event, Provenance } from '@/types';

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { searchParams } = new URL(request.url);
    const includeProvenance = searchParams.get('includeProvenance') === 'true';

    const events = await executeQuery<Event[]>(
      'SELECT * FROM events WHERE person_id = ? ORDER BY date ASC',
      [id]
    );

    // Parse JSON categories for each event
    const parsedEvents = events.map(event => ({
      ...event,
      categories: typeof event.categories === 'string' 
        ? JSON.parse(event.categories) 
        : event.categories || []
    }));

    if (includeProvenance) {
      // Fetch provenance data for each event
      const eventsWithProvenance = await Promise.all(
        parsedEvents.map(async (event) => {
          const provenance = await executeQuery<Provenance[]>(
            'SELECT * FROM provenance WHERE event_id = ?',
            [event.id]
          );
          return { ...event, provenance };
        })
      );

      const response = NextResponse.json({ events: eventsWithProvenance });
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }

    const response = NextResponse.json({ events: parsedEvents });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } catch (error) {
    console.error('Events API error:', error);
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}