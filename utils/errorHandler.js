// extend the Error class
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message); // parent class constructor, pass message to parent (Error class)
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorHandler; // use anywhere
