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
    temp.deliveryTime = new Date(orders.orderTime.getDate() + item.EDT);
    temp.total = item.qty * parseFloat(item.price.split('$')[1], 10);
    enterpriseOrders.push(temp);

    maxEDT = item.EDT > maxEDT ? item.EDT : maxEDT;
    totalCost += item.qty * parseFloat(item.price.split('$')[1], 10);
  }

  console.log('Compiled user order info is: ', enterpriseOrders);

  orders.items = productList;
  orders.orderTime = new Date();
  orders.deliveryTime = new Date(orders.orderTime.getDate() + maxEDT);
  orders.total = `$${totalCost.toFixed(2)}`;

  // Placeholder till queues are implemented
  orders.deliveryStatus = 'pending';

  userOrders.push(orders);

  const db = dbClient.client.db(dbClient.database);
  const orderCOllection = db.collection('orders');
  const userCollection = db.collection('users');

  try {
    const orderResult = await orderCollection.insertMany(enterpriseOrders);
    await userCollection.updateOne({ _id: user._id }, { $set: { orders: userOrders } });

    return res.status(200).json({ message: `Checkout successful, order ID is ${orderResult.insertedId}` });
  } catch (error) {
    console.error('Error encountered: ', error);
    return res.status(503).json({ error: 'Internal Server Error' });
  }
}
