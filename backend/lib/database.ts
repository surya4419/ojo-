import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.TIDB_HOST,
  port: parseInt(process.env.TIDB_PORT || '4000'),
  user: process.env.TIDB_USERNAME,
  password: process.env.TIDB_PASSWORD,
  database: process.env.TIDB_DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
  connectTimeout: 60000,
};

console.log('Database config:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user ? '***' : 'undefined',
  database: dbConfig.database,
});

export async function getConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Database connection established successfully');
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T> {
  console.log('Executing query:', query, 'with params:', params);
  let connection;
  try {
    connection = await getConnection();
    const [results] = await connection.execute(query, params);
    console.log('Query results:', results);
    return results as T;
  } catch (error) {
    console.error('Query execution failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function insertProfile(name: string, summary: string, heroImageUrl?: string): Promise<number> {
  try {
    console.log('Inserting profile:', { name, summary, heroImageUrl });
    const result = await executeQuery<any>(
      'INSERT INTO profiles (name, summary, hero_image_url) VALUES (?, ?, ?)',
      [name, summary, heroImageUrl || null]
    );
    console.log('Profile inserted with ID:', result.insertId);
    return result.insertId;
  } catch (error) {
    console.error('Error inserting profile:', error);
    throw error;
  }
}

export async function insertEvent(
  personId: number,
  date: string,
  eventText: string,
  categories: string[],
  sourceUrl?: string,
  sourceSnippet?: string,
  embedding?: number[],
  confidence: number = 0.9
): Promise<number> {
  try {
    console.log('Inserting event:', { personId, date, eventText, categories });
    
    // Convert embedding to the format expected by TiDB (3-dimensional vector)
    let embeddingStr = '[0,0,0]'; // Default 3D vector
    if (embedding && embedding.length > 0) {
      // Take first 3 dimensions or pad with zeros
      const vector3d = embedding.slice(0, 3);
      while (vector3d.length < 3) {
        vector3d.push(0);
      }
      embeddingStr = `[${vector3d.join(',')}]`;
    }
    
    const result = await executeQuery<any>(
      'INSERT INTO events (person_id, date, event_text, categories, source_url, source_snippet, embedding, confidence) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        personId,
        date,
        eventText,
        JSON.stringify(categories),
        sourceUrl || null,
        sourceSnippet || null,
        embeddingStr,
        confidence
      ]
    );
    console.log('Event inserted with ID:', result.insertId);
    return result.insertId;
  } catch (error) {
    console.error('Error inserting event:', error);
    throw error;
  }
}

export async function insertProvenance(
  eventId: number,
  url: string,
  snippet: string,
  note?: string
): Promise<number> {
  try {
    console.log('Inserting provenance:', { eventId, url });
    const result = await executeQuery<any>(
      'INSERT INTO provenance (event_id, url, fetch_time, snippet, note) VALUES (?, ?, NOW(), ?, ?)',
      [eventId, url, snippet, note || null]
    );
    console.log('Provenance inserted with ID:', result.insertId);
    return result.insertId;
  } catch (error) {
    console.error('Error inserting provenance:', error);
    throw error;
  }
}