const fs = require('fs');
const path = require('path');
const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim().split('#')[0].trim();
    process.env[key] = value;
  }
});
const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('prompt-nexus');
    
    const count = await db.collection('subscriptions').countDocuments();
    console.log("Subscriptions count:", count);
    
    const subs = await db.collection('subscriptions').find({}).limit(5).toArray();
    console.log("Subscriptions sample:", subs);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
main();
