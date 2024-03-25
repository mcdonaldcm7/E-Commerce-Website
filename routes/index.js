import express from 'express';
import { passport } from '../utils/passport';
import {
  createUser,
  resetPasswordToken,
  updatePassword,
  logUserOut,
} from '../controllers/UserAuthController';
import {
  getProducts,
  addProduct,
  removeProduct,
  editProduct,
} from '../controllers/ProductsController';
import { authenticateUser, authorize } from '../controllers/AuthControllers';
import {
  getCart,
  addItemToCart,
  removeItemFromCart,
  updateItemQty,
} from '../controllers/CartsController';
import orderCheckout from '../controllers/OrdersController';
import verifyUserToken from '../utils/verifyUserToken';

const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Welcome to the Home Page' }));

// Authentication Endpoints
router.post('/register', createUser);
router.post('/login', authenticateUser);
router.get('/reset_password', passport.authenticate('jwt', { session: false }),
  verifyUserToken,
  resetPasswordToken);
router.post('/update_password', passport.authenticate('jwt', { session: false }),
  verifyUserToken,
  updatePassword);
router.post('/logout', passport.authenticate('jwt', { session: false }), logUserOut);

// Product Endpoints
router.get('/products', getProducts);
router.post('/products/add', passport.authenticate('jwt', { sesstion: false }),
  authorize('admin'),
  addProduct);

router.delete('/products/:productId/remove/', passport.authenticate('jwt', { session: false }),
  authorize('admin'),
  removeProduct);

router.patch('/products/:productId/edit', passport.authenticate('jwt', { session: false }),
  authorize('admin'),
  editProduct);

// Cart Endpoints
router.get('/cart', getCart);
router.patch('/cart/add', addItemToCart);
router.delete('/cart/remove', removeItemFromCart);
router.patch('/cart/update', updateItemQty);

// Orders Endpoints
// router.get('/orders', passport.authenticate('jwt', { session: false }), authenticateUser, getOrders);
// router.get('/orders/:orderId', passport.authenticate('jwt', { session: false }), authenticateUser, getOrder);
router.get('/orders/checkout', passport.authenticate('jwt', { session: false }),
  verifyUserToken,
  authenticateUser,
  orderCheckout);

// Users Endpoints
router.get('/users/orders', passport.authenticate('jwt', { session: false }),
  verifyUserToken,
  (req, res) => res.status(200).json((req.user.orders || [])));

export default router;
