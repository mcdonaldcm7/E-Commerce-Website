import express from 'express';
import config from 'dotenv';
import routes from './routes/index';

config();

const port = process.env.SERVER_PORT || 5000;
const app = express();

// Middlewares:
// express.json parses incoming requests with JSON payloads
// express.Router creates modular and mountable route handlers
app.use(express.json());
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('...');
});
