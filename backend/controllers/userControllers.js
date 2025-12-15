import wrapAsyncError from "../middleware/wrapAsyncError.js";
import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";

export const registerUser = wrapAsyncError(async (req, res, next) => {
  const { name, password, email } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: { public_id: "this is temp id", url: "this is temp url" },
  });

  const token = user.getJWTToken();

  //creating new resource -> 201
  res.status(201).json({ success: true, user, token });
});

export const loginUser = wrapAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new HandleError("Email or Password is empty", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new HandleError("Invalid Email", 400));
  }

  const isPasswordValid = await user.verifyPassword(password);
  if (!isPasswordValid) {
    return next(new HandleError("Wrong Password", 400));
  }

  const token = user.getJWTToken();
  res.status(200).json({ success: true, user, token });
});
