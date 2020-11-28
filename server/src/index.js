const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const port = process.env.PORT || 1337;

const middlewares = require('./middlewares');
const router = require('../api/file-upload');

const app = express();

// Attaching middleware dependencies
app.use(morgan('common'));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    // eslint-disable-next-line comma-dangle
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Basic api route to check if server is configured correctly
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to this file upload API.' });
});

// Attach api routes
app.use('/api/file-upload', router);

// Attach error handling middlewares
app.use(middlewares.notFound);

app.use(middlewares.errorHandler);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  // console.log(
  //   `File upload API ready for use. Listening at http://localhost:${port}`
  // );
});
