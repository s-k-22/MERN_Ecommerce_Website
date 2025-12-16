import wrapAsyncError from "./wrapAsyncError.js";
import HandleError from "../utils/handleError.js";
import  jwt  from "jsonwebtoken";
import User from "../models/userModel.js";

export const verifyUserAuth = wrapAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  console.log(token);
  
  if (!token) {
    return next(
      new HandleError("Authentication is missing! Please login first..", 400)
    );
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decodedData.id)
  console.log(req.user);
  
  next();
});
