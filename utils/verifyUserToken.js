import redisClient from './redis';

/*
 * verifyUserToken - Checks wether the user's session token is blacklisted
 *
 * @req: Express request argument object
 * @res: Express response argument object
 * @next: Middleware to call after function completion
 *
 * Return: calls next
 */
export default async function verifyUserToken(req, res, next) {
  const token = req.headers.authorization.split(' ')[1];

  const blacklisted = await redisClient.isBlacklisted(token);
  if (blacklisted) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return next();
}
