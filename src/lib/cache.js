import { createClient } from 'redis';
import { REDIS_URL } from '$env/static/private';

let redisClient = null;

// Initialize Redis client
async function getRedisClient() {
	if (!redisClient) {
		redisClient = createClient({
			url: REDIS_URL
		});

		redisClient.on('error', (err) => {
			console.error('Redis Client Error:', err);
		});

		await redisClient.connect();
	}
	return redisClient;
}

/**
 * Get data from Redis cache
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} - Parsed data or null if not found/expired
 */
export async function getFromCache(key) {
	try {
		const client = await getRedisClient();
		const data = await client.get(key);
		
		if (!data) {
			return null;
		}

		return JSON.parse(data);
	} catch (error) {
		console.error('Cache get error:', error);
		return null; // Fail gracefully
	}
}

/**
 * Set data in Redis cache
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} ttlSeconds - Time to live in seconds (default: 3600 = 1 hour)
 */
export async function setCache(key, data, ttlSeconds = 3600) {
	try {
		const client = await getRedisClient();
		await client.setEx(key, ttlSeconds, JSON.stringify(data));
	} catch (error) {
		console.error('Cache set error:', error);
		// Don't throw error - cache failures shouldn't break the app
	}
}

/**
 * Delete data from Redis cache
 * @param {string} key - Cache key to delete
 */
export async function deleteFromCache(key) {
	try {
		const client = await getRedisClient();
		await client.del(key);
	} catch (error) {
		console.error('Cache delete error:', error);
	}
}

/**
 * Generate a standardized cache key
 * @param {string} prefix - Key prefix (e.g., 'repo', 'search', 'api')
 * @param {...string} parts - Key parts to join
 * @returns {string} - Formatted cache key
 */
export function generateCacheKey(prefix, ...parts) {
	return `${prefix}:${parts.filter(Boolean).join(':')}`;
}

/**
 * Cache wrapper function - gets from cache or executes function and caches result
 * @param {string} key - Cache key
 * @param {Function} fetchFunction - Function to execute if cache miss
 * @param {number} ttlSeconds - TTL in seconds
 * @returns {Promise<any>} - Cached or fresh data
 */
export async function cacheWrapper(key, fetchFunction, ttlSeconds = 3600) {
	// Try to get from cache first
	const cachedData = await getFromCache(key);
	if (cachedData !== null) {
		console.log(`Cache hit: ${key}`);
		return cachedData;
	}

	// Cache miss - execute function
	console.log(`Cache miss: ${key}`);
	try {
		const freshData = await fetchFunction();
		
		// Cache the result
		await setCache(key, freshData, ttlSeconds);
		
		return freshData;
	} catch (error) {
		console.error(`Error in cache wrapper for key ${key}:`, error);
		throw error;
	}
}

// Cleanup on process exit
process.on('SIGINT', async () => {
	if (redisClient) {
		await redisClient.quit();
	}
});

process.on('SIGTERM', async () => {
	if (redisClient) {
		await redisClient.quit();
	}
});
