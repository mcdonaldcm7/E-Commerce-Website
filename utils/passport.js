import passport from 'passport';
import passportJWT from 'passport-jwt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
import dbClient from './db';

dotenv.config();

const JwtStrategy = passportJWT.Strategy;
const { ExtractJwt } = passportJWT;
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

async function verifyCallback(jwtPayload, done) {
  try {
    const db = dbClient.client.db(dbClient.database);
    const usersCollection = db.collection('users');

    const id = new ObjectId(jwtPayload.sub);
    const user = await usersCollection.findOne({ _id: id });
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}

const strategy = new JwtStrategy(jwtOptions, verifyCallback);

passport.use(strategy);

function generateToken(user) {
  const payload = {
    sub: user._id,
    email: user.email,
  };
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1d' });
}

export { passport, generateToken };
