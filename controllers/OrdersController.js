import { parse } from 'cookie';
import dbClient from '../utils/db';

export default async function orderCheckout(req, res) {
  const cookies = parse(req.headers.cookie || '');
  const cartJSON = cookies.cart || '[]';
  const cart = JSON.parse(cartJSON);
  const { user } = req;

  if (!user) {
    throw new Error('Skipped two modes of authentication, user is ', user);
  }

  if (cart.length === 0) {
    return res.status(400).json({ error: 'Empty Cart' });
  }

  const productList = [];
  const orders = {};
  const userOrders = user.orders || [];
  let totalCost = 0;

  for (const item of cart) {
    const temp = {};
    temp.item = item.name;
    temp.units = item.qty;
    temp.price = item.price;

    totalCost += item.qty * parseFloat(item.price.split('$')[1], 10);
    productList.push(temp);
  }

  orders.items = productList;
  orders.deliveryTime = new Date();
  orders.orderTime = new Date();
  orders.total = `$${totalCost}`;

  // Placeholder till queues are implemented
  orders.deliveryStatus = 'delivered';

  userOrders.push(orders);

  const db = dbClient.client.db(dbClient.database);
  const orderCollection = db.collection('orders');
  const userCollection = db.collection('users');

  try {
    const orderResult = await orderCollection.insertOne(orders);
    await userCollection.updateOne({ _id: user._id }, { $set: { orders: userOrders } });

    return res.status(200).json({ message: `Checkout successful, order ID is ${orderResult.insertedId}` });
  } catch (error) {
    console.error('Error encountered: ', error);
    return res.status(503).json({ error: 'Internal Server Error' });
  }
}
