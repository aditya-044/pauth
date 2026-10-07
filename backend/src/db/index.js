import mongoose from 'mongoose';
import { getEnv } from '../config/config.js';

async function connectDB() {
  try {
    const conn = await mongoose.connect(getEnv("MONGODB_URI"));
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export { connectDB };