interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

interface PersonData {
  name: string;
  summary: string;
  events: {
    date: string;
    event_text: string;
    categories: string[];
    source_url?: string;
    source_snippet?: string;
    confidence: number;
  }[];
  hero_image_url?: string;
}

export async function fetchPersonData(personName: string): Promise<PersonData | null> {
  const prompt = `Research and provide comprehensive biographical information about "${personName}".
  
  Please return the data in the following JSON format:
  {
    "name": "Full Name",
    "summary": "A comprehensive 200-word biography covering key achievements, career progression, and significant milestones",
    "events": [
      {
        "date": "YYYY-MM-DD",
        "event_text": "Description of the event",
        "categories": ["birth", "education", "career", "award", "achievement", "role"],
        "source_url": "URL if available",
        "source_snippet": "Relevant text snippet from source",
        "confidence": 0.95
      }
    ],
    "hero_image_url": "https://example.com/image.jpg - Only include if you can provide a real, publicly accessible image URL"
  }
  
  Focus on:
  - Birth date and place
  - Education milestones
  - Career progression and major roles
  - Awards and achievements
  - Significant life events
  - Current position/status
  
  Ensure all dates are in YYYY-MM-DD format. Only include verifiable information with high confidence scores (0.8+).
  Categories should be one of: birth, education, career, award, achievement, role, personal, other.
  For hero_image_url, only include real, publicly accessible URLs. If no suitable image URL is available, omit this field or set it to null.
  
  If the person is not a notable public figure or insufficient information is available, return null.`;

  try {
    console.log('Fetching person data for:', personName);
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 0.8,
          maxOutputTokens: 4096,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, response.statusText, errorText);
      return null;
    }

    const data: GeminiResponse = await response.json();
    const content = data.candidates[0]?.content.parts[0]?.text;
    
    if (!content) {
      console.error('No content received from Gemini API');
      return null;
    }

    console.log('Gemini API response content:', content);

    // Extract JSON from the response (handle markdown code blocks)
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in Gemini response:', content);
      return null;
    }

    const jsonStr = jsonMatch[1] || jsonMatch[0];
    console.log('Extracted JSON string:', jsonStr);
    
    const personData: PersonData = JSON.parse(jsonStr);
    
    // Validate the data structure
    if (!personData || !personData.name || !personData.summary || !Array.isArray(personData.events)) {
      console.error('Invalid person data structure:', personData);
      return null;
    }

    console.log('Successfully parsed person data:', personData.name, 'with', personData.events.length, 'events');
    return personData;
  } catch (error) {
    console.error('Error fetching person data:', error);
    return null;
  }
}

export async function generateEmbedding(text: string): Promise<number[] | null> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'models/text-embedding-004',
        content: {
          parts: [{
            text: text
          }]
        }
      })
    });

    if (!response.ok) {
      console.error('Embedding API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data.embedding?.values || null;
  } catch (error) {
    console.error('Error generating embedding:', error);
    return null;
  }
}

export async function generateBiography(events: string[], personName: string): Promise<string> {
  const prompt = `Create a concise, engaging biography for ${personName} based on these verified events:
  
${events.join('\n')}

Focus on key achievements, career progression, and significant milestones. Keep it factual and well-structured. Limit to 200 words.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const data: GeminiResponse = await response.json();
    return data.candidates[0]?.content.parts[0]?.text || '';
  } catch (error) {
    console.error('Gemini API error:', error);
    return '';
  }
}