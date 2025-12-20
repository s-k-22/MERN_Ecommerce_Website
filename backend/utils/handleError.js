class HandleError extends Error {
  constructor(message, statusCode) {
    super(message); //Error class has msg but not statuscode
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor); //without Error.captureStackTrace -> lot of messages on terminal when error occurs
  }
}

export default HandleError;
