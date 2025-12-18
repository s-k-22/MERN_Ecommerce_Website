import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [25, "Invalid name. Please enter less than 25 characters"],
    minLength: [3, "Name should contain more than 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    select: false, //hidden by default while sending data
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//password hashing before saving to the DB
userSchema.pre("save", async function (next) {
  //avoid rehashing of password
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcryptjs.hash(this.password, 10);
});

//generate jwt
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPRIRE,
  });
};

//verify password
userSchema.methods.verifyPassword = async function (userEnteredPassword) {
  return await bcryptjs.compare(userEnteredPassword, this.password);
};

//reset password token
userSchema.methods.generateResetPassToken = function(){
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now()+ 30*60*1000; //30min
  return resetToken;
}

export default mongoose.model("User", userSchema);
