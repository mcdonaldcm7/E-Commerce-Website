import redisClient from './redis';

export default async function verifyUserToken(req, res, next) {
  const token = req.headers.authorization.split(' ')[1];

  const blacklisted = await redisClient.isBlacklisted(token);
  if (blacklisted) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return next();
}
