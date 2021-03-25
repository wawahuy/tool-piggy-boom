import mongoose from 'mongoose';
import dbConfigs from '../configs/db';
import { logger } from '../helpers/logger';

export default function initMongo() {
  const uri = dbConfigs.MONGO_URI;
  
  if (!uri) {
    logger.error('mongo - uri null');
    return;
  }

  mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

  mongoose.connection.once('open', () => {
    logger.info('MongoDB connected!');
  });

  mongoose.connection.on('error', (error: Error) => {
    logger.error(error?.stack?.toString());
  });
}