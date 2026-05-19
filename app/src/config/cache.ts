import Redis from "ioredis";

let redisClient: Redis | null = null;

function getRedisClient() {
  if (redisClient !== null) {
    return redisClient;
  }

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    redisClient = null;
    return null;
  }

  redisClient = new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
  });

  redisClient.on("error", (error) => {
    console.warn("Redis error:", error.message);
  });

  return redisClient;
}

export async function cacheGetJson<T>(key: string) {
  const client = getRedisClient();
  if (!client) {
    return null;
  }

  try {
    const cachedValue = await client.get(key);
    if (!cachedValue) {
      return null;
    }

    return JSON.parse(cachedValue) as T;
  } catch (error) {
    console.warn("Cache read failed:", error);
    return null;
  }
}

export async function cacheSetJson(key: string, value: unknown, ttlSeconds = 60) {
  const client = getRedisClient();
  if (!client) {
    return;
  }

  try {
    await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch (error) {
    console.warn("Cache write failed:", error);
  }
}

export async function cacheDelete(key: string) {
  const client = getRedisClient();
  if (!client) {
    return;
  }

  try {
    await client.del(key);
  } catch (error) {
    console.warn("Cache delete failed:", error);
  }
}