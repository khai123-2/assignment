const customerRouter = require('./customer.route');
const employeeRouter = require('./employee.route');
const userRouter = require('./user.route');
const docsRouter = require('./docs.route');
const errorHandler = require('@/middleware/errorHandler');
const logHandle = require('@/middleware/logHandle');
const logRouter = require('./log.route');
function route(app) {
  app.use(logHandle);
  app.use('/api/customers', customerRouter);
  app.use('/api/employees', employeeRouter);
  app.use('/api/users', userRouter);
  app.use('/api-docs', docsRouter);
  app.use('/api/logs', logRouter);
  // Error Handler
  app.use(errorHandler);
}

module.exports = route;
