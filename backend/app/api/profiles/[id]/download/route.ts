import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { Profile, Event } from '@/types';
import { generateBiography } from '@/lib/gemini';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Fetch profile and events
    const profiles = await executeQuery<Profile[]>(
      'SELECT * FROM profiles WHERE id = ?',
      [id]
    );

    if (profiles.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const profile = profiles[0];
    
    const events = await executeQuery<Event[]>(
      'SELECT * FROM events WHERE person_id = ? ORDER BY date ASC',
      [id]
    );

    const parsedEvents = events.map(event => ({
      ...event,
      categories: typeof event.categories === 'string' 
        ? JSON.parse(event.categories) 
        : event.categories || []
    }));

    // Generate AI biography if needed
    let aiSummary = profile.summary;
    if (parsedEvents.length > 0) {
      const eventTexts = parsedEvents.map(e => `${e.date}: ${e.event_text}`);
      aiSummary = await generateBiography(eventTexts, profile.name) || profile.summary;
    }

    // Create comprehensive report data
    const reportData = {
      profile: {
        ...profile,
        aiSummary
      },
      events: parsedEvents,
      statistics: {
        totalEvents: parsedEvents.length,
        categories: [...new Set(parsedEvents.flatMap(e => e.categories))],
        avgConfidence: parsedEvents.reduce((acc, e) => acc + e.confidence, 0) / parsedEvents.length,
        dateRange: {
          earliest: parsedEvents[0]?.date,
          latest: parsedEvents[parsedEvents.length - 1]?.date
        }
      },
      generatedAt: new Date().toISOString()
    };

    // In a real implementation, you'd use a PDF generation library like puppeteer or jsPDF
    // For now, we'll return JSON data that can be processed client-side
    const reportJson = JSON.stringify(reportData, null, 2);
    
    return new NextResponse(reportJson, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${profile.name}-analysis.json"`,
      },
    });
  } catch (error) {
    console.error('Download API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}