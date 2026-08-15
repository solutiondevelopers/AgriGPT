import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';

dotenv.config();

let mongoServer: MongoMemoryServer;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri) {
      // Connect to Atlas or external MongoDB
      await mongoose.connect(mongoUri);
      console.log('🌱 MongoDB connected to External Cluster');
    } else {
      // Fallback for AI Studio preview / local dev without credentials
      console.log('⚠️ No MONGODB_URI provided. Starting in-memory MongoDB for development...');
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log('🌱 MongoDB connected to In-Memory Server');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};
