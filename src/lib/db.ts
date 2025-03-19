import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017/learnix"; // Change for production
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Extend the global type to include _mongoClientPromise
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Use globalThis to ensure correct scope
if (!globalThis._mongoClientPromise) {
  client = new MongoClient(uri, options);
  globalThis._mongoClientPromise = client.connect();
}
clientPromise = globalThis._mongoClientPromise;

export default clientPromise;
