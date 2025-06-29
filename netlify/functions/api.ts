import serverless from 'serverless-http';
import app from '../../backend/app';

// Create the serverless handler
const handler = serverless(app, {
  binary: false,
});

export { handler };