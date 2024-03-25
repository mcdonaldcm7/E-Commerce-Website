import { parse, serialize } from 'cookie';
import dbClient from '../utils/db';

export async function getCart(req, res) {
  const cookies = parse(req.headers.cookie || '');
  const cartJSON = cookies.cart || '[]';
  const cart = JSON.parse(cartJSON);

  return res.json(cart);
}

/*
 * addItemToCart - Adds the specified item to the cart if not already in cart
 *
 * @req: Request Argument containing the query object within which the query parameters
 * productName, productId, and qty may be found
 *
 * @res: Response object to populate with reponses
 * Return: Populated res object
 */
export async function addItemToCart(req, res) {
  // Fetch query parameters from the request argument `req`
  const { productName, productId } = req.query;
  const qty = parseInt(req.query.qty, 10) || 1;

  // Handles case: Item not added in cart and negative number requested
  if (qty < 1) {
    return res.status(404).json({ error: 'Invalid number of item units requested' });
  }

  // Handles case: Insufficient item information supplied to compose query
  if (!productName && !productId) {
    return res.status(404).json({
      error: 'Unable to compose query, Insufficient item information supplied',
    });
  }

  const cookies = parse(req.headers.cookie || '');
  const cartJSON = cookies.cart || '[]';
  const cart = JSON.parse(cartJSON);

  for (const item of cart) {
    if (item.name === productName) {
      return res.status(400).json({ error: 'Item already exists in cart, update instead' });
    }
  }

  let product;

  try {
    product = await dbClient.getProduct(productName, productId);
  } catch (error) {
    console.error(`Error encountered in attempting to find product with query {${productName}, ${productId}}`);
    console.error(error);
    return res.status(503).json({ error: 'Internal Server Error' });
  }

  if (!product) {
    let message;

    if (productName) {
      message = `Item ${productName} not found`;
    } else {
      message = `Product with ID: ${productId} not found`;
    }
    return res.status(404).json({ error: message });
  }

  // Handles case:  Quantity of item in store is insufficient
  if (qty > product.quantity) {
    const message = `Insufficient item in stock inventory(${product.quantity}) to meet request`;
    return res.status(400).json({ error: message });
  }

  // Update the quatity of item in the products database
  try {
    await dbClient.updateProductQuantity(productName, productId, (product.quantity - qty));
  } catch (error) {
    console.error('Error encountered in attempting to update item quantity: ', error);
    return res.status(503).json({ error: 'Internal Server Error' });
  }

  cart.push({
    id: product._id,
    name: product.name,
    price: product.price,
    qty,
  });

  const newCartJson = JSON.stringify(cart);
  const cartCookie = serialize('cart', newCartJson, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    path: '/',
    httpOnly: true,
  });

  res.setHeader('Set-Cookie', cartCookie);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  return res.end('Cart item added successfully');
}

export async function removeItemFromCart(req, res) {
  // Fetch query parameters from the request argument `req`
  const { productName, productId } = req.query;

  // Handles case: Insufficient item information supplied to compose query
  if (!productName && !productId) {
    return res.status(404).json({
      error: 'Unable to compose query, Insufficient item information supplied',
    });
  }

  let product;

  try {
    product = await dbClient.getProduct(productName, productId);
  } catch (error) {
    console.error(`Error encountered in attempting to find product with query {${productName}, ${productId}}`);
    console.error(error);
    return res.status(503).json({ error: 'Internal Server Error' });
  }

  if (!product) {
    let message;

    if (productName) {
      message = `Item ${productName} not found`;
    } else {
      message = `Product with ID: ${productId} not found`;
    }
    return res.status(404).json({ error: message });
  }

  const cookies = parse(req.headers.cookie || '');
  const cartJSON = cookies.cart || '[]';
  let cart = JSON.parse(cartJSON);
  let itemFound = false;

  try {
    let cartQty = 0;
    for (const i in cart) {
      if (cart[i].name === productName || cart[i].id === productId) {
        // Remove item from cart and add quantity back to the product in the database
        cartQty = cart[i].qty;
        cart = cart.splice(i, i);
        itemFound = true;
      }
    }

    if (!itemFound) {
      return res.status(400).json({ error: 'Item not found in cart' });
    }

    await dbClient.updateProductQuantity(productName, productId, (product.quantity + cartQty));
  } catch (error) {
    console.error('Error encountered in attempting to update item quantity: ', error);
    return res.status(503).json({ error: 'Internal Server Error' });
  }

  const newCartJson = JSON.stringify(cart);
  const cartCookie = serialize('cart', newCartJson, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    path: '/',
    httpOnly: true,
  });

  res.setHeader('Set-Cookie', cartCookie);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  return res.end('Cart item removed successfully');
}

export async function updateItemQty(req, res) {
  // Fetch query parameters from request argument `req`
  const { productName, productId } = req.query;

  if (!req.query.qty) {
    return res.status(400).json({ error: 'Quantity change not supplied' });
  }

  const qty = parseInt(req.query.qty, 10);

  // Validate the presence of at least one of the two product identifiers
  if (!productName && !productId) {
    return res.status(404).json({ error: 'Missing product information to make query' });
  }

  let product;
  try {
    product = await dbClient.getProduct(productName, productId);
  } catch (error) {
    console.error(`Error encountered in attempting to find product with query {${productName}, ${productId}}`);
    console.error(error);
    return res.status(503).json({ error: 'Internal Server Error' });
  }

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const cookies = parse(req.headers.cookie || '');
  const cartJSON = cookies.cart || '[]';
  let cart = JSON.parse(cartJSON);
  let itemFound = false;

  try {
    let newQuantity = qty;

    if (product.quantity - qty < 0) {
      const message = `Insufficient item in stock inventory(${product.quantity}) to meet request`;
      return res.status(400).json({ error: message });
    }

    for (const i in cart) {
      if (cart[i].id.toString() === product._id.toString() || cart[i].name === product.name) {
        newQuantity = product.quantity - qty;
        cart[i].qty += qty;
        if (cart[i].qty <= 0) {
          cart = cart.splice(i, i);
        }
        itemFound = true;
        break;
      }
    }

    if (!itemFound) {
      return res.status(400).json({ error: 'Item not found in cart' });
    }

    await dbClient.updateProductQuantity(product.name, product.id, newQuantity);
  } catch (error) {
    console.error('Error encountered updating product quantity: ', error);
    return res.status(503).json({ error: 'Internal Server Error' });
  }

  const newCartJson = JSON.stringify(cart);
  const cartCookie = serialize('cart', newCartJson, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    path: '/',
    httpOnly: true,
  });

  res.setHeader('Set-Cookie', cartCookie);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  return res.end('Cart item updated successfully');
}
