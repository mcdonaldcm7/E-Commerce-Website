import passport from 'passport';
import { ObjectId } from 'mongodb';
import dbClient from './db';
import verifyUser from './verifyUser';

const LocalStrategy = require('passport-local').Strategy;

async function verifyCallback(username, password, done) {
  const db = dbClient.client.db(dbClient.database);
  const userCollection = await db.collection('users');

  const user = await userCollection.findOne({ email: username });
  if (!user) {
    return done(null, false, { message: 'Incorrect email' });
  }

  const isValid = await verifyUser(username, password);
  if (!isValid) {
    return done(null, false, { message: 'Incorrect password' });
  }
  return done(null, user);
}

const strategy = new LocalStrategy({ usernameField: 'email' }, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  dbClient.client.collection('users')
    .then((userCollection) => {
      userCollection.findOne({ _id: ObjectId(id) }, (err, user) => {
        done(err, user);
      });
    });
});
