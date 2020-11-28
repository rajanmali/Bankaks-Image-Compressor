/*  Middleware to handle not found error  */
const notFound = (req, res, next) => {
  const error = new Error(`Cannot find the route - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/*  Middleware to handle all other general errors  */
// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
