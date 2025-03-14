import mongoose from "mongoose";

const connections: { [key: string]: mongoose.Connection | null } = {
  main: null,
  chat: null,
};

/**
 * Connect to the specified MongoDB database (main or chat)
 */
export async function connectToDatabase(dbName: "main" | "chat"): Promise<mongoose.Connection> {
  if (connections[dbName]) {
    console.log(`Using existing connection for ${dbName} database`);
    return connections[dbName]!;
  }

  const uri = dbName === "chat" ? process.env.MONGODB_URI_CHAT : process.env.MONGODB_URI_MAIN;
  if (!uri) {
    throw new Error(`Missing MongoDB URI for ${dbName}`);
  }

  try {
    console.log(`Connecting to ${dbName} database...`);
    const connection = await mongoose.createConnection(uri, {
      connectTimeoutMS: 10000,
    }).asPromise();

    console.log(`${dbName} database connected successfully`);
    
    // Handle disconnection events
    connection.on("disconnected", () => {
      console.warn(`${dbName} database disconnected`);
      connections[dbName] = null;
    });

    connection.on("error", (err) => {
      console.error(`${dbName} database connection error:`, err);
      connections[dbName] = null;
    });

    connections[dbName] = connection;
    return connection;
  } catch (error) {
    console.error(`Error connecting to ${dbName} database:`, error);
    throw error;
  }
}

/**
 * Disconnect all MongoDB connections
 */
export async function disconnectFromAllDatabases() {
  for (const key in connections) {
    if (connections[key]) {
      await connections[key]!.close();
      console.log(`${key} database disconnected`);
      connections[key] = null;
    }
  }
}

/**
 * Get an existing connection for a database
 */
export function getDatabaseConnection(dbName: "main" | "chat"): mongoose.Connection | null {
  return connections[dbName] || null;
}
