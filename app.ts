import express, { Express, Request, Response } from 'express';

import registerRoutes from './src/routes';

const app: Express = express();
const port = process.env.PORT || 3000;

// Register routes
registerRoutes(app);

app.listen(port, () => {
  const date = new Date();
  const isoDT = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
  console.log(`(${isoDT}) Service successfully started at http://localhost:${port}`);
});