import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

/*
 * DBClient: Handles interaction with the mongodb database
 *
 * @database: Name of the enterprise' database
 * @client: MongoClient instance
 */
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

  /*
   * nbUser - Fetches and returns the number of user
   *
   * Return: Number of users
   */
  async nbUsers() {
    try {
      const db = this.client.db(this.database);
      const usersCount = await db.collection('users').countDocuments();
      return usersCount;
    } catch (error) {
      console.error(error);
      return -1;
    }
  }

  /*
   * nbProducts - Fetches and returns the number of products
   *
   * Return: Number of products
   */
  async nbProducts() {
    try {
      const db = this.client.db(this.database);
      const productsCount = await db.collection('products').countDocuments();
      return productsCount;
    } catch (error) {
      console.error(error);
      return -1;
    }
  }

  /*
   * getProduct - Fetches and returns the product using the name and/or the id to compose the query
   *
   * @name: Name of product to search for
   * @id: ID of product to search for
   *
   * Return: Product corresponding to the specified arguments passed
   */
  async getProduct(name, id) {
    const db = this.client.db(this.database);
    const query = {};

    if (!name && !id) {
      return new Error('Insufficient query information passed');
    }

    if (name !== undefined) {
      query.name = name;
    }

    if (id !== undefined) {
      query._id = ObjectId(id);
    }

    try {
      const product = await db.collection('products').findOne(query);
      return product;
    } catch (error) {
      console.error(error);
      return new Error(`getProduct: Error encountered in querying for ${query}`);
    }
  }

  /*
   * getProductQty - Fetches and returns the product quantity using the name and/or the id to
   * compose the query
   *
   * @name: Name of product to search for
   * @id: ID of product to search for
   *
   * Return: Quantity of the product corresponding to the specified arguments passed
   */
  async getProductQty(name, id) {
    const db = this.client.db(this.database);
    const query = {};

    if (!name && !id) {
      return new Error('Insufficient query information passed');
    }

    if (name !== undefined) {
      query.name = name;
    }

    if (id !== undefined) {
      query._id = ObjectId(id);
    }
    try {
      const product = await db.collection('products').findOne(query);
      if (product) {
        return product.quantity;
      }
      return 0;
    } catch (error) {
      console.error(error);
      return new Error(`getProductQty: Error encountered in querying for ${query}`);
    }
  }

  /*
   * updateProductQuantity - Updates the quantity of the product specified by the name and/or the id
   *
   * @name: Name of product to search for
   * @id: ID of product to search for
   *
   * Return: Error on failure, Otherwise, a success prompt
   */
  async updateProductQuantity(name, id, newQuantity) {
    const db = this.client.db(this.database);
    const productCollection = db.collection('products');
    const query = {};

    if ((!name && !id) || !newQuantity) {
      return new Error('Insufficient query information passed');
    }

    if (name !== undefined) {
      query.name = name;
    }

    if (id !== undefined) {
      query._id = ObjectId(id);
    }

    try {
      await productCollection.updateOne(query, {
        $set: { quantity: newQuantity },
      });
      return { success: true, newQuantity };
    } catch (error) {
      console.error(error);
      return new Error('updateProductQty: Error encountered in updating product info');
    }
  }
}

const dbClient = new DBClient();

export default dbClient;
