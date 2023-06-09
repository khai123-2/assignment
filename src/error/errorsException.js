class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
  }
}
class ValidationError extends Error {
  constructor(message) {
    super();
    this.status = 422;
    this.messageObject = message;
  }
}

module.exports = {
  UnauthorizedError,
  NotFoundError,
  ValidationError,
};
