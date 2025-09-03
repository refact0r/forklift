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
 * @param {number|null} ttlSeconds - Time to live in seconds (null = auto-determine based on key prefix)
 */
export async function setCache(key, data, ttlSeconds = null) {
	try {
		const client = await getRedisClient();
		// Use provided TTL or auto-determine based on key prefix
		const finalTTL = ttlSeconds !== null ? ttlSeconds : getTTLByKey(key);
		await client.setEx(key, finalTTL, JSON.stringify(data));
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
 * Get appropriate TTL based on cache key prefix
 * @param {string} key - Cache key
 * @returns {number} - TTL in seconds
 */
function getTTLByKey(key) {
	const prefix = key.split(':')[0];
	
	switch (prefix) {
		case 'repo':
		case 'search':
		case 'api':
			// Repo summaries, search results, API responses - change less frequently
			return 7 * 24 * 3600; // 7 days
		case 'issues':
		case 'issue':
			// Issues are more dynamic - shorter cache
			return 2 * 24 * 3600; // 2 days
		case 'user':
		case 'profile':
			// User data - moderate cache
			return 3 * 24 * 3600; // 3 days
		default:
			// Default fallback
			return 24 * 3600; // 24 hours
	}
}

/**
 * Cache wrapper function - gets from cache or executes function and caches result
 * @param {string} key - Cache key
 * @param {Function} fetchFunction - Function to execute if cache miss
 * @param {number|null} ttlSeconds - TTL in seconds (null = auto-determine based on key prefix)
 * @returns {Promise<any>} - Cached or fresh data
 */
export async function cacheWrapper(key, fetchFunction, ttlSeconds = null) {
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

		// Cache the result with intelligent TTL
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
