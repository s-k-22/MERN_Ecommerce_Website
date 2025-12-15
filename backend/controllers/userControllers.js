import wrapAsyncError from "../middleware/wrapAsyncError.js";
import User from "../models/userModel.js";

export const registerUser = wrapAsyncError(async (req, res, next) => {
  const { name, password, email } = req.body;
  const user = await User.create({
    name,
    email, 
    password,
    avatar: { public_id: "this is temp id", url: "this is temp url" },
  });

  res.status(200).json({ success: true, user });
});
