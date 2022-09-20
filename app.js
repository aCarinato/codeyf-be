import express from 'express';
import 'dotenv/config';

import connectDB from './config/db.js';

// ROUTES
import people from './routes/people.js';
import auth from './routes/auth.js';

connectDB();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE'
  );

  next();
});

app.use('/api/people', people);
app.use('/api/auth', auth);

app.listen(port, () => console.log(`Server running on port ${port}`));
