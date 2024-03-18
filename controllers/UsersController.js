import bcrypt from 'bcryptjs';
import dbClient from '../utils/db';

export default async function createUser(req, res) {
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

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  try {
    const result = await userCollection.insertOne({ email, password: hash });
    return res.status(201).json({ id: result.insertedId, email });
  } catch (err) {
    console.error(`Error inserting new user document to collection: ${err}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
