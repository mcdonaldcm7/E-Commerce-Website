import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';

export async function addProduct(req, res) {
  const {
    name,
    price,
    description,
    colors,
    sizes,
  } = req.body;
  let { quantity, EDT } = req.body;

  if (!name || !price || !quantity || !description || !EDT) {
    let missing;
    if (!name) {
      missing = 'name';
    } else if (!price) {
      missing = 'price';
    } else if (!quantity) {
      missing = 'quantity';
    } else if (!description) {
      missing = 'description';
    } else {
      missing = 'EDT (Expected Delivery Time)';
    }
    return res.status(400).json({ error: `Product details supplied missing ${missing}` });
  }

  quantity = parseInt(req.body.quantity, 10);
  EDT = parseInt(req.body.EDT, 10);
  if (Number.isNaN(quantity) || Number.isNaN(EDT)) {
    const wrongType = Number.isNaN(quantity) ? 'quantity' : 'EDT (Expected Delivery Time)';
    return res.status(400).json({ error: `${wrongType} should be a number` });
  }

  const newProduct = {
    name,
    price,
    quantity,
    description,
    EDT,
  };

  if (colors) {
    newProduct.colors = colors;
  }

  if (sizes) {
    newProduct.sizes = sizes;
  }

  try {
    const db = dbClient.client.db(dbClient.database);
    const productCollection = db.collection('products');

    const result = await productCollection.insertOne(newProduct);
    return res.status(201).json({
      message: 'New product added successfully',
      id: result.insertedId,
    });
  } catch (error) {
    console.error('Error encountered in addProduct, ', error);
    return res.status(503).json({ error: 'Internal Server Error' });
  }
}

export async function removeProduct(req, res) {
  const { productId } = req.params;

  try {
    const db = dbClient.client.db(dbClient.database);
    const productCollection = db.collection('products');

    await productCollection.deleteOne({ _id: new ObjectId(productId) });
    return res.status(200).json({ message: 'Item removed successfully' });
  } catch (error) {
    console.error('Error encountered in removeProduct, ', error);
    return res.status(503).json({ error: 'Internal Server Error' });
  }
}

export async function editProduct(req, res) {
  const { productId } = req.params;

  try {
    const db = dbClient.client.db(dbClient.database);
    const productCollection = db.collection('products');

    if (!dbClient.getProduct({ id: productId })) {
      console.log('Product not found');
      return res.status(400).json({ error: 'Product not found' });
    }

    await productCollection.updateOne({ _id: new ObjectId(productId) }, { $set: req.body });
    return res.status(200).json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error('Error encountered in removeProduct, ', error);
    return res.status(503).json({ error: 'Internal Server Error' });
  }
}

export async function getOrders(req, res) {
  const { productName } = req.query;
  const { page } = req.query.page || 0;

  if (Number.isNaN(page)) {
    return res.status(400).json({ error: 'Page must be a valid number' });
  }

  const pageSize = 10;
  const skip = page * pageSize;
  const query = {};

  if (productName !== undefined) {
    query.name = productName;
  }

  const pipeline = [
    { $match: query },
    { $skip: skip },
    { $limit: pageSize },
  ];

  try {
    const db = dbClient.client.db(dbClient.database);
    const orderCollection = db.collection('orders');
    return await orderCollection.agregate(pipeline).toArray();
  } catch (error) {
    console.error(error);
    return res.status(503).json({ error: 'Internal Server Error' });
  }
}

export async function getOrder(req, res) {
  const { orderId } = req.params;

  if (!orderId) {
    return res.status(400).json({ error: 'Bad Request, OrderID Missing' });
  }

  try {
    const db = dbClient.client.db(dbClient.database);
    const orderCollection = db.collection('orders');
    const order = await orderCollection.findOne({ _id: new ObjectId(orderId) });

    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res.status(503).json({ error: 'Internal Server Error' });
  }
}
