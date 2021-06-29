
const express = require('express');
// const helmet = require('helmet');
// const xss = require('xss-clean');
// const mongoSanitize = require('express-mongo-sanitize');
// const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
// const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
// const { errorConverter, errorHandler } = require('./middlewares/error');
// const ApiError = require('./utils/ApiError');





const mongodb = require('./models/problemdb');
mongodb.connect();


// =========================================================
const app = express();

// logging
app.use(morgan('dev'));




// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// parse cookie
app.use(cookieParser());





// enable cors
app.use(cors({ origin: "http://localhost:3000" }));
// app.options('*', cors());




// api routes
app.use('/', routes);



// set security HTTP headers
// app.use(helmet());

// sanitize request data
// app.use(xss());
// app.use(mongoSanitize());

// gzip compression
// app.use(compression());



// limit repeated failed requests to auth endpoints 
/*
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}
*/


// send back a 404 error for any unknown api request
/*
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});
*/

// convert error to ApiError, if needed
// app.use(errorConverter);

// handle error
// app.use(errorHandler);



module.exports = app;

