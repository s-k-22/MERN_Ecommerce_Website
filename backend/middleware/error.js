import HandleError from "../utils/handleError.js";

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //for cast error -> 99% it's about _id -> invalid value is provided for a field that requires a specific data type
  if (err.name === "CastError") {
    const message = `Invalid  resource ${err.path}`;
    err = new HandleError(message, 404);
  }

  //for unique fields in db
  if (err.code === 11000) {
    const message = `This ${Object.keys(
      err.keyValue
    )} already registered. Please Login to continue...`;
    err = new HandleError(message, 404);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
