import { Handler } from '@netlify/functions';
import { MongoClient } from 'mongodb';

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
    const { parentsNames, genderPreference } = JSON.parse(event.body || '{}');

    if (!parentsNames || !genderPreference) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    await client.connect();
    const db = client.db('babynames');
    const projects = db.collection('projects');

    const project = {
      parents_names: parentsNames,
      gender_preference: genderPreference,
      created_at: new Date().toISOString(),
      created_by: 'anonymous',
    };

    const result = await projects.insertOne(project);

    return {
      statusCode: 200,
      body: JSON.stringify({ projectId: result.insertedId }),
    };
  } catch (error) {
    console.error('Error creating project:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create project' }),
    };
  } finally {
    await client.close();
  }
};

export { handler };
