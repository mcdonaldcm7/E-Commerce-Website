import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import passport from 'passport';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import routes from './routes/index';
import './utils/passport'; // Import the configured Passport.js instance

dotenv.config();

const port = process.env.SERVER_PORT || 5000;
const app = express();
const redisStoreClient = createClient();

redisStoreClient.connect().catch(console.error);

const redisStore = new RedisStore({
  client: redisStoreClient,
  prefix: 'e-commerce-website',
});

// Middlewares:
// express.json parses incoming requests with JSON payloads
// express.Router creates modular and mountable route handlers
// passport.initialize sets req._passport, passport is used for user authentication
app.use(express.json());
app.use(session({
  store: redisStore,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('...');
});
