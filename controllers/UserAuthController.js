import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

dotenv.config();

/*
 * createUser - Creates a new user from the infomation supplied in the request body
 *
 * @req: Express request object
 * @res: Express response object
 *
 * Return: Output prompt containing user ID on success or error message with reason on failure
 */
export async function createUser(req, res) {
  const { email, password } = req.body;

  if (email === undefined) {
    return res.status(400).json({ error: 'Missing email' });
  }

  if (typeof email !== 'string') {
    return res.status(400).json({ error: 'email must be a string' });
  }

  // Regex text for the format of the email address passed
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (password === undefined) {
    return res.status(400).json({ error: 'Missing password' });
  }

  if (password.length < 14) {
    return res.status(400).json({ error: 'Password length must be at least 14' });
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
    const role = email === process.env.ADMIN_EMAIL ? 'admin' : 'user';
    const result = await userCollection.insertOne({
      email, password: hash, resetToken: undefined, orderHistory: [], cart: [], role,
    });
    return res.status(201).json({
      id: result.insertedId,
      email,
      message: `${email} has been registered successfully`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/*
 * resetPassword - Generates and returns a reset password token for the user
 *
 * @req: Express request object
 * @res: Express response object
 *
 * Return: Output prompt containing token on success or error message on failure
 */
export async function resetPasswordToken(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Missing email' });
  }

  try {
    const db = dbClient.client.db(dbClient.database);
    const userCollection = db.collection('users');

    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    await userCollection.updateOne({ email }, { $set: { resetToken } });

    return res.status(200).json({ email, resetToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/*
 * updatePassword - Validates the reset password token supplied in the json body and updates the
 * user password
 *
 * @req: Express request object
 * @res: Express response object
 *
 * Return: Output prompt containing token on success or error message on failure
 */
export async function updatePassword(req, res) {
  const { email, resetToken, newPassword } = req.body;

  if (email === undefined) {
    return res.status(400).json({ error: 'User email not supplied' });
  }

  if (resetToken === undefined) {
    return res.status(400).json({ error: 'Reset Token not supplied!' });
  }

  if (newPassword === undefined) {
    return res.status(400).json({ error: 'New password not supplied' });
  }

  if (newPassword.length < 14) {
    return res.status(400).json({ error: 'Password length must be at least 14' });
  }

  const db = dbClient.client.db(dbClient.database);
  const userCollection = db.collection('users');
  let user = null;

  try {
    user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const match = bcrypt.compareSync(newPassword, user.password);
    if (match) {
      return res.status(400).json({ message: 'New password cannot be same as old password' });
    }
  } catch (err) {
    console.error('Error encountered in comparing passwords: ', err);
    return res.status(500).json({ error: 'Internal Server Error' });
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

/*
 * logUserOut - Nullifies the user's session token
 *
 * @req: Express request object
 * @res: Express response object
 *
 * Return: Output prompt containing token on success or error message on failure
 */
export async function logUserOut(req, res) {
  const token = req.headers.authorization.split(' ')[1];

  try {
    await redisClient.addToBlacklist(token);
  } catch (err) {
    console.log('Error encountered in adding user token to balcklist: ', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  return res.status(301).redirect('/products');
}
