const MongoClient = require('mongodb').MongoClient;
const mongo_config = require('../config/mongodb_config.json');
const app = require('./app');

const port = process.env.PORT || 4000;

let server;
MongoClient.connect(mongo_config.url).then(() => {
  console.log('Connected to MongoDB');
  server = app.listen(port, () => {
    console.log(`Listening to port ${port}`);
  });
});


/*
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
*/
