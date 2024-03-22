import express from 'express';
import { passport } from '../utils/passport';
import {
  createUser,
  resetPasswordToken,
  updatePassword,
  logUserOut,
} from '../controllers/UsersController';
import getProducts from '../controllers/ProductsController';
import authenticateUser from '../controllers/AuthControllers';
import { getCart, addItemToCart } from '../controllers/CartsController';
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

// Unimplemented
// router.get('/products/:productId/edit', editProduct);
// router.get('/products/:productId/delete', deleteProduct);

// Cart Endpoints
router.get('/cart', getCart);
router.patch('/cart/add', addItemToCart);
// router.patch('/cart/update', updateItemInCart);
// router.delete('/cart/remove', removeItemInCart);

export default router;
