import bcrypt from 'bcryptjs';
import dbClient from '../utils/db';
import { generateToken } from '../utils/passport';

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
    return res.status(401).json({ error: 'Incorrect email' });
  }

  try {
    const match = bcrypt.compareSync(password, user.password);
    if (match) {
      const token = generateToken(user);
      const path = req.originalUrl.split('/').pop();
      if (!['login'].includes(path)) {
        return next();
      }
      return res.status(200).json({ message: 'Login successful', token });
    }
    return res.status(401).json({ error: 'Incorrect Password' });
  } catch (err) {
    console.error('Error encountered: ', err);
    return res.status(503).json({ error: 'Internal Server Error' });
  }
}

export function authorize(role) {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  };
}
