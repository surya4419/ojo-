import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { Profile, Event } from '@/types';

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
    const profiles = await executeQuery<Profile[]>(
      'SELECT * FROM profiles WHERE id = ?',
      [id]
    );

    if (profiles.length === 0) {
      const response = NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }

    const events = await executeQuery<Event[]>(
      'SELECT * FROM events WHERE person_id = ? ORDER BY date ASC',
      [id]
    );

    const parsedEvents = events.map((event) => ({
      ...event,
      categories: typeof event.categories === 'string' ? JSON.parse(event.categories) : event.categories || []
    }));

    const response = NextResponse.json({ profile: profiles[0], events: parsedEvents });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } catch (error) {
    console.error('Profile API error:', error);
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}