import redis from "redis";
let redisClient = null;
async function initializeRedis() {
  redisClient = redis.createClient({
    username: process.env.REDIS_USERNAME || "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST || "localhost",
      port: process.env.REDIS_PORT || 6379,
      
    },
    
  });

  redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);
  });
  redisClient.on("connect", () => {
    console.log("Redis Client Connected");
  });
  await redisClient.connect();
  return redisClient;
}

function getRedisClient() {
  if (!redisClient) {
    throw new Error(
      "Redis client not initialized. Call initializeRedis() first.",
    );
  }
  return redisClient;
}

export { initializeRedis, getRedisClient };
