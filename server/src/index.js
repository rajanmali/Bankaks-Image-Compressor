const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();

const port = process.env.PORT || 1337;

const middlewares = require('./middlewares');
const router = require('../api/file-upload');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('common'));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    // eslint-disable-next-line comma-dangle
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'File upload API ready for use' });
});

app.use('/api/file-upload', router);

app.use(middlewares.notFound);

app.use(middlewares.errorHandler);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening at http://localhost:${port}`);
});
