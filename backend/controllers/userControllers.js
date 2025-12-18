import wrapAsyncError from "../middleware/wrapAsyncError.js";
import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";

export const registerUser = wrapAsyncError(async (req, res, next) => {
  const { name, password, email } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: { public_id: "this is temp id", url: "this is temp url" },
  });

  //creating new resource -> 201
  sendToken(user, 201, res);
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

  sendToken(user, 200, res);
});

export const logout = wrapAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "Successfully Logged Out." });
});

export const resetPasswordRequest = wrapAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new HandleError("User doesn't exist", 404));
  }
  let resetToken;
  try {
    resetToken = user.generateResetPassToken();
    await user.save({ validateBeforeSave: false });
  } catch (error) {
    console.log(error);
    return next(
      new HandleError("Could not save reset token. Please try again later", 400)
    );
  }

  const resetPasswordURL = `http://localhost:8000/reset/${resetToken}`;
  const msg = `Hello,Click the link below to reset your password. This link is valid for 30 minutes:\n\n ${resetPasswordURL}.\n\n If you did not request this, please ignore this email.`;
  try {
    //send email functionality
    await sendEmail({
      email: user.email,
      subject: "Password reset request",
      msg,
    });
    
    res
      .status(200)
      .json({ success: true, message: `Email sent to ${user.email} successfully.` });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    next(
      new HandleError("Email could not be sent. Please try again later.", 500)
    );
  }
});
