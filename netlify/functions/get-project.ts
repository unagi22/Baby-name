import { Handler } from '@netlify/functions';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const projectId = event.path.split('/').pop();
    if (!projectId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Project ID is required' }),
      };
    }

    await client.connect();
    const db = client.db('babynames');
    const projects = db.collection('projects');

    const project = await projects.findOne({ _id: new ObjectId(projectId) });

    if (!project) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Project not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(project),
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch project' }),
    };
  } finally {
    await client.close();
  }
};

export { handler };
