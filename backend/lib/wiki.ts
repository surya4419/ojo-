export interface WikiCandidate {
  name: string;
  descriptor: string;
  source_url: string;
  snippet: string;
  similarity_score: number;
}

export async function searchWikipediaCandidates(query: string): Promise<WikiCandidate[]> {
  const api = `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=6&srsearch=${encodeURIComponent(query)}`;
  const resp = await fetch(api, { cache: 'no-store' });
  if (!resp.ok) return [];
  const data = await resp.json();
  const results = (data?.query?.search || []) as any[];
  // Filter to likely person pages only and titles that actually contain the query token
  const disallowed = /(discography|election|album|film|soundtrack|season|episode|legislative|list of)/i;
  const firstToken = query.trim().toLowerCase().split(/\s+/)[0];
  return results
    .filter((r) => r.ns === 0 && !disallowed.test(r.title || ''))
    .filter((r) => {
      const titleLc = String(r.title || '').toLowerCase();
      const words = titleLc.split(/[^a-z0-9]+/);
      return words.includes(firstToken);
    })
    .map((r) => {
      const title = r.title as string;
      const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s/g, '_'))}`;
      const snippet = (r.snippet || '').replace(/<\/?span[^>]*>/g, '').replace(/<[^>]+>/g, '');
      const similarity = Math.max(0, 1 - (r.index || 0) * 0.1);
      return {
        name: title,
        descriptor: r.title,
        source_url: url,
        snippet,
        similarity_score: similarity,
      } as WikiCandidate;
    });
}

export async function getWikipediaSummary(title: string): Promise<{ extract: string; url: string; image?: { url: string } ; wikidataId?: string; } | null> {
  const api = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const resp = await fetch(api, { cache: 'no-store' });
  if (!resp.ok) return null;
  const data = await resp.json();
  const url = data?.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s/g, '_'))}`;
  const image = data?.thumbnail?.source ? { url: data.thumbnail.source as string } : undefined;
  const wikidataId = data?.wikibase_item as string | undefined;
  return { extract: data?.extract || '', url, image, wikidataId };
}

export async function getWikidataDOB(wikidataId: string): Promise<string | null> {
  try {
    const api = `https://www.wikidata.org/wiki/Special:EntityData/${encodeURIComponent(wikidataId)}.json`;
    const resp = await fetch(api, { cache: 'no-store' });
    if (!resp.ok) return null;
    const data = await resp.json();
    const entity = data?.entities?.[wikidataId];
    const p569 = entity?.claims?.P569?.[0]?.mainsnak?.datavalue?.value?.time as string | undefined;
    if (!p569) return null;
    // Format like +1972-06-10T00:00:00Z -> 1972-06-10
    const match = p569.match(/([+-]?\d{4}-\d{2}-\d{2})/);
    if (!match) return null;
    const iso = match[1].replace('+', '');
    return iso;
  } catch {
    return null;
  }
}

export async function getWikidataIsHuman(wikidataId: string): Promise<boolean> {
  try {
    const api = `https://www.wikidata.org/wiki/Special:EntityData/${encodeURIComponent(wikidataId)}.json`;
    const resp = await fetch(api, { cache: 'no-store' });
    if (!resp.ok) return false;
    const data = await resp.json();
    const entity = data?.entities?.[wikidataId];
    const instanceClaims = entity?.claims?.P31 || [];
    // Q5 is human
    return instanceClaims.some((c: any) => c?.mainsnak?.datavalue?.value?.id === 'Q5');
  } catch {
    return false;
  }
}

export async function getWikipediaFullText(title: string): Promise<string | null> {
  try {
    const api = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&exintro=false&explaintext=true&titles=${encodeURIComponent(title)}`;
    const resp = await fetch(api, { cache: 'no-store' });
    if (!resp.ok) return null;
    const data = await resp.json();
    const pages = data?.query?.pages || {};
    const page = Object.values(pages)[0] as any;
    return page?.extract || null;
  } catch {
    return null;
  }
}

export async function extractTimelineEvents(fullText: string, personName: string): Promise<Array<{
  date: string;
  event_text: string;
  categories: string[];
  source_snippet: string;
  confidence: number;
}>> {
  const events = [];
  const lines = fullText.split('\n').filter(line => line.trim());
  
  for (const line of lines) {
    // Look for year patterns and career/education keywords
    const yearMatch = line.match(/(\d{4})/);
    if (!yearMatch) continue;
    
    const year = yearMatch[1];
    const lowerLine = line.toLowerCase();
    
    // Education events
    if (lowerLine.includes('graduated') || lowerLine.includes('degree') || lowerLine.includes('university') || lowerLine.includes('college') || lowerLine.includes('studied')) {
      events.push({
        date: `${year}-01-01`,
        event_text: line.trim(),
        categories: ['education'],
        source_snippet: line.trim().substring(0, 100),
        confidence: 0.8
      });
    }
    
    // Career events
    if (lowerLine.includes('joined') || lowerLine.includes('founded') || lowerLine.includes('started') || lowerLine.includes('became') || lowerLine.includes('appointed') || lowerLine.includes('ceo') || lowerLine.includes('director') || lowerLine.includes('president')) {
      events.push({
        date: `${year}-01-01`,
        event_text: line.trim(),
        categories: ['career'],
        source_snippet: line.trim().substring(0, 100),
        confidence: 0.8
      });
    }
    
    // Awards and recognition
    if (lowerLine.includes('award') || lowerLine.includes('honor') || lowerLine.includes('recognition') || lowerLine.includes('prize') || lowerLine.includes('medal')) {
      events.push({
        date: `${year}-01-01`,
        event_text: line.trim(),
        categories: ['award'],
        source_snippet: line.trim().substring(0, 100),
        confidence: 0.8
      });
    }
    
    // Personal milestones
    if (lowerLine.includes('married') || lowerLine.includes('birth') || lowerLine.includes('death') || lowerLine.includes('retired')) {
      events.push({
        date: `${year}-01-01`,
        event_text: line.trim(),
        categories: ['personal'],
        source_snippet: line.trim().substring(0, 100),
        confidence: 0.8
      });
    }
  }
  
  return events.slice(0, 10); // Limit to top 10 events
}


