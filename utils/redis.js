import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.connect();
    this.client.on('error', (err) => {
      console.error(err);
    });
  }

  // Add a token to the blacklist
  async addToBlacklist(token) {
    try {
      await this.client.SADD('blacklist', token);
    } catch (error) {
      console.error('Error adding token to blacklist:', error);
      throw error;
    }
  }

  // Check if a token is blacklisted
  async isBlacklisted(token) {
    try {
      return await this.client.SISMEMBER('blacklist', token);
    } catch (error) {
      console.error('Error checking token blacklist:', error);
      throw error;
    }
  }
}

const redisClient = new RedisClient();

export default redisClient;
