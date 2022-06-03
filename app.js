const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
// Express order matters
const app = express();

// 1) Middlewares
app.use(express.json()); //To assign request.body()

// custom middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3rd party middleware morgan
// console.log(process.env);
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// 3) Routes

// mount the rounters on root
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) Server
module.exports = app;
