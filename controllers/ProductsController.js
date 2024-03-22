import dbClient from '../utils/db';

export default async function getProducts(req, res) {
  const { productName, productId } = req.query;
  const page = req.query.page || 0;
  const pageSize = 10;
  const skip = page * pageSize;
  const query = {};

  /*
   * Prevent creating multiple endpoints for all categories by simple attaching the product
   * category and then redirecting the user to the new request with product category as a query
   * parameter e.g User visits endpoint 'http://<domain name>/api/products
   * users clicks on the category 'Electronics', redirect user to the endpoint with query parameter
   * 'http://<domain name>/api/products?category=Electronics
   */
  if (req.query.category !== undefined) {
    query.category = req.query.category;
  }

  if (req.query.color !== undefined) {
    query.colors = req.query.color;
  }

  if (productName !== undefined) {
    query.productName = productName;
  }

  if (productId !== undefined) {
    query.productId = productId;
  }

  const pipeline = [
    { $match: query },
    { $skip: skip },
    { $limit: pageSize },
  ];

  const db = dbClient.client.db(dbClient.database);
  const productsCollection = db.collection('products');
  const products = await productsCollection.aggregate(pipeline).toArray();

  const productsList = [];
  for (const product of products) {
    if (product.quantity > 0) {
      const temp = {
        id: String(product._id),
        name: product.name,
        price: product.price,
        category: product.category,
        quantity: product.quantity,
      };

      if (product.colors) {
        temp.colors = product.colors;
      }

      if (product.sizes) {
        temp.sizes = product.sizes;
      }
      productsList.push(temp);
    }
  }

  return res.json(productsList);
}

/*
 * export async function getProductById(req, res) {
  const { productId } = req.params;

  if (productId === undefined) {
    return res.status(400).json({ error: 'Invalid product ID supplied' });
  }

  const db = dbClient.client.db(dbClient.database);
  const productsCollection = db.collection('products');
  const product = await productsCollection.findOne({ _id: ObjectId(productId) });

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const temp = {
    name: product.name,
    price: product.price,
    category: product.category,
    quantity: product.quantity,
  };

  if (product.colors) {
    temp.colors = product.colors;
  }

  if (product.sizes) {
    temp.sizes = product.sizes;
  }

  return res.status(200).json(temp);
 }
*/
