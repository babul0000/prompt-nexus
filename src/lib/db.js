import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("MONGODB_URI environment variable is not defined");
}

let client;
let db;

if (process.env.NODE_ENV === "development") {
    if (!global._mongoClient) {
        global._mongoClient = new MongoClient(uri);
        global._mongoDb = global._mongoClient.db("prompt-nexus");
    }
    client = global._mongoClient;
    db = global._mongoDb;
} else {
    client = new MongoClient(uri);
    db = client.db("prompt-nexus");
}

export { client };
export default db;
