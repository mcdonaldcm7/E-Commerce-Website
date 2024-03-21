import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'e_commerce_website';

    const url = `mongodb://${host}:${port}/${this.database}`;

    this.client = new MongoClient(url);
    this.connect();
  }

  async connect() {
    try {
      await this.client.connect();
    } catch (error) {
      console.error(error);
    }
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    const db = this.client.db(this.database);
    const usersCount = await db.collection('users').countDocuments();
    return usersCount;
  }

  async nbProducts() {
    const db = this.client.db(this.database);
    const productsCount = await db.collection('products').countDocuments();
    return productsCount;
  }
}

const dbClient = new DBClient();

export default dbClient;
