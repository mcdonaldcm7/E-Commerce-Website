import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export async function createUser(req, res) {
  const { email, password } = req.body;

  if (email === undefined) {
    return res.status(400).json({ error: 'Missing email' });
  }

  if (password === undefined) {
    return res.status(400).json({ error: 'Missing password' });
  }

  const db = dbClient.client.db(dbClient.database);
  const userCollection = db.collection('users');

  const user = await userCollection.findOne({ email });
  if (user !== null) {
    return res.status(400).json({ error: 'Already exist' });
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  try {
    const result = await userCollection.insertOne({
      email, password: hash, resetToken: undefined, orderHistory: [], cart: [],
    });
    return res.status(201).json({ id: result.insertedId, email });
  } catch (err) {
    console.error('Error inserting new user document to collection: ', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function resetPasswordToken(req, res) {
  const { email } = req.user;

  if (!email) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  const db = dbClient.client.db(dbClient.database);
  const userCollection = db.collection('users');

  const resetToken = crypto.randomBytes(32).toString('hex');
  await userCollection.updateOne({ email }, { $set: { resetToken } });

  return res.status(200).json({ email, resetToken });
}

export async function updatePassword(req, res) {
  const { user } = req;

  if (!user) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  const { resetToken, newPassword } = req.body;

  if (resetToken === undefined) {
    return res.status(400).json({ error: 'Reset Token not supplied!' });
  }

  if (newPassword === undefined) {
    return res.status(400).json({ error: 'New password not supplied' });
  }

  const db = dbClient.client.db(dbClient.database);
  const userCollection = db.collection('users');

  try {
    const match = bcrypt.compareSync(newPassword, user.password);
    if (match) {
      return res.status(400).json({ message: 'New password cannot be same as old password' });
    }
  } catch (err) {
    console.error('Error encountered in comparing passwords: ', err);
    return res.status(503).json({ error: 'Internal Server Error' });
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newPassword, salt);

  try {
    await userCollection.updateOne(
      { email: user.email, resetToken },
      { $set: { password: hash, resetToken: undefined } },
    );

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error encountered in updating user password: ', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function logUserOut(req, res) {
  const token = req.headers.authorization.split(' ')[1];

  try {
    await redisClient.addToBlacklist(token);
  } catch (err) {
    console.log('Error encountered in adding user token to balcklist: ', err);
    return res.status(503).json({ error: 'Internal Server Error' });
  }
  return res.status(301).redirect('/products');
}
