import wrapAsyncError from "../middleware/wrapAsyncError.js";
import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

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

//sending forgot password link to email
export const resetPasswordRequest = wrapAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new HandleError("User doesn't exist", 404));
  }
  let resetToken;
  try {
    resetToken = user.generateResetPassToken(); //not hashed token
    await user.save({ validateBeforeSave: false }); //saving hashed token
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

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    next(
      new HandleError("Email could not be sent. Please try again later.", 500)
    );
  }
});

//reset password
export const resetPassword = wrapAsyncError(async (req, res, next) => {
  //hash token from link params to get db token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new HandleError(
        "Reset password token is invalid or has been expired",
        404
      )
    );
  }

  const { password, confirmPassword } = req.body;
  if (password != confirmPassword) {
    return next(new HandleError("Password doesn't match", 404));
  }
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});

export const getUserDetails = wrapAsyncError(async (req, res, next) => {
  const user = await User.find({ _id: req.user.id });
  res.status(200).json({ success: true, user });
});

export const updatePassword = wrapAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  const user = await User.findById(req.user.id).select("+password");
  const checkOldPassword = await user.verifyPassword(oldPassword);
  if (!checkOldPassword) {
    return next(
      new HandleError("Password doesn't match with old password", 404)
    );
  }

  if (newPassword !== confirmPassword) {
    return next(new HandleError("Password doesn't match", 404));
  }

  user.password = newPassword;
  await user.save();
  sendToken(user, 200, res);
});

export const updateProfile = wrapAsyncError(async (req, res, next) => {
  const { name, email } = req.body;
  const updateOptions = { name, email };
  const user = await User.findByIdAndUpdate(req.user.id, updateOptions, {
    new: true,
    runValidators: true,
  });
  res
    .status(200)
    .json({ success: true, message: "user is updated successfylly", user });
});

//admin - get all users
export const getAllUsers = wrapAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, users });
});

//admin - get single user
export const getSingleUser = wrapAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new HandleError("user does not exist", 400));
  }
  res.status(200).json({ success: true, user });
});

//admin - update user role
export const updateUserRole = wrapAsyncError(async (req, res, next) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new HandleError("user does not exist", 404));
  }
  res
    .status(200)
    .json({ success: true, message: "User role is updated successfully" });
});

//admin - delete user profile
export const deleteUserProfile = wrapAsyncError(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new HandleError("user does not exist", 400));
  }
  res
    .status(200)
    .json({ success: true, message: "User profile is deleted successfully" });
});
