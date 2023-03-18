import express from 'express';
import statusRoutes from './routes/status';
import playlistRoutes from './routes/playlist';
import epgRoutes from './routes/epg';
import helpersRoutes from './routes/helpers';

export default function registerRoutes(app: express.Application) {
  app.use('/', statusRoutes);
  app.use('/playlist', playlistRoutes);
  app.use('/epg', epgRoutes);
  app.use('/helpers', helpersRoutes);
}