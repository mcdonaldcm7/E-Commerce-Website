import { parse } from 'cookie';
import dotenv from 'dotenv';
import dbClient from '../utils/db';

dotenv.config();

/*
 * orderCheckout - Organizes the selected items in the user's cart and save the order to the
 * database, hence enabling the user to see their order history
 *
 * @req: Express request object
 * @res: Express response object
 *
 * Return: Prompt depending on whether or not checkout was successful
 */
export async function orderCheckout(req, res) {
  const cookies = parse(req.headers.cookie || '');
  const cartJSON = cookies.cart || '[]';
  const cart = JSON.parse(cartJSON);
  const { user } = req;

  if (!user) {
    throw new Error('Unauthenticated user granted access: ', user);
  }

  if (cart.length === 0) {
    return res.status(400).json({ error: 'Empty Cart' });
  }

  const productList = [];
  const orders = {};
  const enterpriseOrders = [];
  const userOrders = user.orders || [];
  let totalCost = 0;
  let maxEDT = 0;

  for (const item of cart) {
    const temp = {};
    temp.item = item.name;
    temp.units = item.qty;
    temp.price = item.price;
    productList.push(temp);

    temp.orderTime = new Date();
    temp.deliveryTime = new Date(temp.orderTime);
    temp.deliveryTime.setDate(temp.orderTime.getDate() + item.EDT);
    temp.total = item.qty * parseFloat(item.price.split('$')[1], 10);
    enterpriseOrders.push(temp);

    maxEDT = item.EDT > maxEDT ? item.EDT : maxEDT;
    totalCost += item.qty * parseFloat(item.price.split('$')[1], 10);
  }

  orders.items = productList;
  orders.orderTime = new Date();
  orders.deliveryTime = new Date(orders.orderTime.getDate() + maxEDT);
  orders.total = `$${totalCost.toFixed(2)}`;

  // Placeholder till queues are implemented
  orders.deliveryStatus = 'pending';

  userOrders.push(orders);

  const db = dbClient.client.db(dbClient.database);
  const orderCollection = db.collection('orders');
  const userCollection = db.collection('users');

  try {
    await orderCollection.insertMany(enterpriseOrders);
    await userCollection.updateOne(
      { _id: user._id },
      { $set: { orders: userOrders } },
    );

    return res.status(200).json({ message: 'Checkout successful' });
  } catch (error) {
    console.error('Error encountered: ', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/*
 * getUserOrderHistory - Retrieves and returns the requested page of the user's order history
 *
 * @req: Express request object
 * @res: Express response object
 *
 * Return: List of user order history
 */
export async function getUserOrderHistory(req, res) {
  // (req, res) => res.status(200).json((req.user.orders || [])));
  const { orders } = req.user;

  if (!orders || orders.length === 0) {
    return res.status(200).json([]);
  }

  const pageSize = 5;
  let page = parseInt(req.query.page, 10) || 0;

  if (Number.isNaN(page) || page < 0) {
    return res.status(400).json({ error: 'Page should be a valid non-negative number' });
  }

  page = ((page * pageSize) > orders.length) ? Math.floor(orders.length / pageSize) : page;

  const start = page * pageSize;
  let end = start + pageSize;
  end = (start + pageSize) < orders.length ? end : (orders.length - 1);
  // start = start >= end ? (start - pageSize) : start;
  return res.status(200).json(orders.slice(start, end));
}

/*
 * getUserOrder - Retrieves and returns a specific user order history
 *
 * @req: Express request object
 * @res: Express response object
 *
 * Return: User order history
 */
export async function getUserOrder(req, res) {
  const { email } = req.params;
  const pageSize = 5;
  let page = parseInt(req.query.page, 10) || 0;

  if (!email) {
    return res.status(400).json({ error: 'Email not supplied' });
  }

  /*
  if (email === process.env.ADMIN_EMAIL) {
    return res.status(401).json({ error: 'Can\'t access admin info' });
  }
  */

  if (Number.isNaN(page) || page < 0) {
    return res.status(400).json({ error: 'Page should be a valid non-negative number' });
  }

  try {
    const db = dbClient.client.db(dbClient.database);
    const userCollection = db.collection('users');
    const user = await userCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { orders } = user;
    page = ((page * pageSize) > orders.length) ? Math.floor(orders.length / pageSize) : page;

    const start = page * pageSize;
    let end = start + pageSize;
    end = (start + pageSize) < orders.length ? end : (orders.length - 1);

    return res.status(200).json(orders.slice(start, end));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
