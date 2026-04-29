import mongoose, { Connection } from 'mongoose';

/**
 * Global type definition for cached Mongoose connection.
 * This prevents multiple connections during development by storing the connection
 * in the global object, which persists across module reloads in Next.js dev mode.
 */
declare global {
  var mongooseConnection: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

// Initialize global object if it doesn't exist
let cached = global.mongooseConnection || {
  conn: null,
  promise: null,
};

if (!global.mongooseConnection) {
  global.mongooseConnection = cached;
}

/**
 * Connects to MongoDB using Mongoose with connection caching.
 * 
 * - In development: Reuses existing connection from global cache
 * - In production: Creates a new connection per request (connection pooling handled by MongoDB)
 * 
 * @returns {Promise<Connection>} The Mongoose connection object
 * @throws {Error} If MongoDB URI is not defined or connection fails
 */
async function connectToDatabase(): Promise<Connection> {
  // Return cached connection if it exists
  if (cached.conn) {
    return cached.conn;
  }

  // Return existing promise to avoid multiple simultaneous connection attempts
  if (cached.promise) {
    return cached.promise;
  }

  // Get MongoDB URI from environment variables
  const MONGODB_URI = process.env.MONGODB_URI;

  // Validate that MongoDB URI is provided
  if (!MONGODB_URI) {
    throw new Error(
      'MONGODB_URI is not defined. Please set it in your .env.local file.'
    );
  }

  // Create new connection promise
  const promise = mongoose
    .connect(MONGODB_URI, {
      bufferCommands: false,
    })
    .then((mongoose) => {
      return mongoose.connection;
    })
    .catch((error) => {
      // Clear the cached promise on connection failure to allow retry
      cached.promise = null;
      throw error;
    });

  cached.promise = promise;

  try {
    // Wait for connection to establish
    cached.conn = await promise;
  } catch (error) {
    // Clear cache on error
    cached.conn = null;
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;
