import bcrypt from 'bcryptjs';
import dbClient from '../utils/db';
import generateToken from '../utils/passport';

export default async function authenticateUser(req, res) {
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
      return res.status(200).json({ message: 'Login successful', token });
    }
    return res.status(401).json({ error: 'Unauthorized' });
  } catch (err) {
    console.error('Error comparing passwords');
    return res.status(503).json({ error: 'Internal Server Error' });
  }
}
