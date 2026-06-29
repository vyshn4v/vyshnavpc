import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config({ path: "./src/.env.local" });

const flushCache = async () => {
  const client = createClient({
    username: process.env.REDIS_USERNAME || "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST || "localhost",
      port: process.env.REDIS_PORT || 6379,
    }
  });
  client.on('error', err => console.error('Redis Client Error', err));
  await client.connect();
  const keys = await client.keys('*docs:*');
  if (keys.length > 0) {
    await client.del(keys);
    console.log(`Cleared ${keys.length} cache keys from Redis.`);
  } else {
    console.log('No docs cache keys found.');
  }
  process.exit(0);
};

flushCache();
