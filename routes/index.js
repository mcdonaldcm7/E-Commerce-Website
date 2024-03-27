import express from 'express';
import { passport } from '../utils/passport';
import { authenticateUser, authorize } from '../controllers/AuthControllers';
import getProducts from '../controllers/ProductsController';
import orderCheckout from '../controllers/OrdersController';
import verifyUserToken from '../utils/verifyUserToken';

import {
  createUser,
  resetPasswordToken,
  updatePassword,
  logUserOut,
} from '../controllers/UserAuthController';

import {
  addProduct,
  removeProduct,
  editProduct,
  getOrders,
  getOrder,
} from '../controllers/AdminController';

import {
  getCart,
  addItemToCart,
  removeItemFromCart,
  updateItemQty,
} from '../controllers/CartsController';

const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Welcome to the Home Page' }));

// Authentication Endpoints
router.post('/register', createUser);

router.post('/login', authenticateUser);

router.get('/reset_password', resetPasswordToken);

router.post('/update_password', passport.authenticate('jwt', { session: false }),
  verifyUserToken,
  updatePassword);

router.post('/logout', passport.authenticate('jwt', { session: false }), logUserOut);

// Product Endpoints
router.get('/products', getProducts);

// Admin Endpoints
router.post('/admin/products/add', passport.authenticate('jwt', { session: false }),
  authorize('admin'),
  addProduct);

router.delete('/admin/products/:productId/remove/', passport.authenticate('jwt', { session: false }),
  authorize('admin'),
  removeProduct);

router.patch('/admin/products/:productId/edit', passport.authenticate('jwt', { session: false }),
  authorize('admin'),
  editProduct);

router.get('/admin/orders', passport.authenticate('jwt', { session: false }), authorize('admin'),
  getOrders);

router.get('/admin/orders/:orderId', passport.authenticate('jwt', { session: false }),
  authorize('admin'),
  getOrder);

// Cart Endpoints
router.get('/cart', getCart);
router.patch('/cart/add', addItemToCart);
router.delete('/cart/remove', removeItemFromCart);
router.patch('/cart/update', updateItemQty);

// Orders Endpoints
router.get('/orders/checkout', passport.authenticate('jwt', { session: false }),
  verifyUserToken,
  authenticateUser,
  orderCheckout);

// Users Endpoints
router.get('/users/orders', passport.authenticate('jwt', { session: false }),
  verifyUserToken,
  (req, res) => res.status(200).json((req.user.orders || [])));

export default router;
