import mongoose from 'mongoose';
import appConfigs from '../configs/app';
import dbConfigs from '../configs/db';

export default function initMongo() {
  const uri = dbConfigs.MONGO_URI;
  
  if (!uri) {
    console.log('MongoDB - uri null!');
    return;
  }

  mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

  mongoose.connection.once('open', () => {
    console.log('MongoDB connected!');
  });

  mongoose.connection.on('error', (error) => {
    console.log('MongoDB error!', error);
  });
}