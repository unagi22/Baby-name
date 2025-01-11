import { Handler } from '@netlify/functions';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const { projectId, name, gender, suggestedBy } = JSON.parse(event.body || '{}');

    if (!projectId || !name || !gender || !suggestedBy) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    await client.connect();
    const db = client.db('babynames');
    const suggestions = db.collection('suggestions');

    const suggestion = {
      project_id: new ObjectId(projectId),
      name,
      gender,
      suggested_by: suggestedBy,
      likes: 0,
      is_favorite: false,
      created_at: new Date().toISOString(),
    };

    const result = await suggestions.insertOne(suggestion);
    suggestion._id = result.insertedId;

    return {
      statusCode: 200,
      body: JSON.stringify(suggestion),
    };
  } catch (error) {
    console.error('Error adding suggestion:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to add suggestion' }),
    };
  } finally {
    await client.close();
  }
};

export { handler };
