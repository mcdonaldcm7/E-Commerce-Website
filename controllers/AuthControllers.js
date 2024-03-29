import bcrypt from 'bcryptjs';
import dbClient from '../utils/db';
import { generateToken } from '../utils/passport';

/*
 * authenticateUser - Authenticates user credential passed
 *
 * @req: Express request object
 * @res: Express response object
 * @next: Function to call if available and user has been authenticated
 *
 * Return: Prompts depending on wether or not authentication was successful
 */
export async function authenticateUser(req, res, next) {
  // Check if user is already authenticated, If so skip and call next()
  if (req.user) {
    return next();
  }

  const { email, password } = req.body;

  if (email === undefined) {
    return res.status(401).json({ error: 'Missing email' });
  }

  if (password === undefined) {
    return res.status(401).json({ error: 'Missing password' });
  }

  const db = dbClient.client.db(dbClient.database);
  const usersCollection = db.collection('users');
  const user = await usersCollection.findOne({ email });

  if (!user) {
    return res.status(401).json({ error: 'User not found, please check for errors in email' });
  }

  try {
    const match = bcrypt.compareSync(password, user.password);
    if (match) {
      const token = generateToken(user);

      res.setHeader('Authorization', `Bearer ${token}`);
      const path = req.originalUrl.split('/').pop();
      if (!['login'].includes(path)) {
        return next();
      }
      const message = user.role === 'admin' ? 'Admin Login Successful' : 'Login Successful';
      return res.status(200).json({ message });
    }
    return res.status(401).json({ error: 'Incorrect Password' });
  } catch (err) {
    console.error('Error encountered: ', err);
    return res.status(503).json({ error: 'Internal Server Error' });
  }
}

/*
 * authorize - Authorizes permitted user and forbids users without the sufficient role
 *
 * @role: Required user role
 *
 * Return: Call next() if user.role === role, Otherwise forbids user
 */
export function authorize(role) {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  };
}
