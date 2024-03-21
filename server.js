import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import routes from './routes/index';

dotenv.config();

const port = process.env.SERVER_PORT || 5000;
const app = express();

// Middlewares:
// express.json parses incoming requests with JSON payloads
// express.Router creates modular and mountable route handlers
// passport.initialize sets req._passport, passport is used for user authentication
app.use(express.json());
app.use(passport.initialize());
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('...');
});
