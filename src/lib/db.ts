import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp';

// Connection state interface
interface MongoConnection {
isConnected: boolean;
client: typeof mongoose | null;
promise: Promise<typeof mongoose> | null;
}

// Connection state with initial values
const connection: MongoConnection = {
isConnected: false,
client: null,
promise: null,
};

/**
* Global function to connect to MongoDB with caching
*/
export async function connectToDatabase(): Promise<typeof mongoose> {
// If we're already connected, return the existing connection
if (connection.isConnected) {
    console.log('Using existing MongoDB connection');
    return connection.client!;
}

// If a connection is in progress, wait for it to complete
if (connection.promise) {
    console.log('Waiting for existing MongoDB connection promise to resolve');
    return connection.promise;
}

// Create a new connection promise
connection.promise = mongoose
    .connect(MONGODB_URI, {
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    })
    .then((mongoose) => {
    console.log('MongoDB connected successfully');
    
    // Update connection state
    connection.isConnected = true;
    connection.client = mongoose;
    
    // Handle disconnect events
    mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
        connection.isConnected = false;
    });
    
    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
        connection.isConnected = false;
    });
    
    return mongoose;
    })
    .catch((err) => {
    console.error('MongoDB connection error:', err);
    connection.promise = null;
    throw err;
    });

return connection.promise;
}

/**
* Get the database client - will connect automatically if not connected
*/
export async function getDbClient(): Promise<typeof mongoose> {
return connectToDatabase();
}

/**
* Get a direct reference to the MongoDB connection
*/
export function getMongoConnection(): mongoose.Connection | null {
return connection.client?.connection || null;
}

/**
* Disconnect from MongoDB - useful for testing and controlled shutdowns
*/
export async function disconnectFromDatabase(): Promise<void> {
if (connection.isConnected && connection.client) {
    await connection.client.disconnect();
    connection.isConnected = false;
    connection.client = null;
    connection.promise = null;
    console.log('MongoDB disconnected');
}
}

// Default export for easier imports
export default {
connect: connectToDatabase,
getClient: getDbClient,
getConnection: getMongoConnection,
disconnect: disconnectFromDatabase,
};

