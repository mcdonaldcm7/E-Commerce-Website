import bcrypt from 'bcryptjs';
import dbClient from '../utils/db';

export async function createUser(req, res) {
  const { email, password } = req.body;

  if (email === undefined) {
    return res.status(400).json({ error: 'Missing email' });
  }

  if (password === undefined) {
    return res.status(400).json({ error: 'Missing password' });
  }

  const userCollection = dbClient.client.db(dbClient.database).collection('users');

  const user = await userCollection.findOne({ email });
  if (user !== null) {
    return res.status(400).json({ error: 'Already exist' });
  }
  return bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        console.error('Error hashing supplied password');
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      return userCollection.insertOne({ email, password: hash }, (error, result) => {
        if (error) {
          console.error('Error encountered when creating new user!');
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(201).json({ id: result.insertedId, email });
      });
    });
  });
}
