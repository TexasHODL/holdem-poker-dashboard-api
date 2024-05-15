import { connect } from 'mongoose';
require('dotenv').config();
const { MONGO_URI } = process.env;

// Connecting to the database
/**
 * return boolean
 */
export async function connectToMongoose(dbName: string) {
  try {
    return await connect(MONGO_URI as string, { dbName });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
