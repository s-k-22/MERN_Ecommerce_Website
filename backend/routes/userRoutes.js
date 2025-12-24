import express from "express";
import {
  getUserDetails,
  loginUser,
  logout,
  registerUser,
  resetPassword,
  resetPasswordRequest,
  updatePassword,
  updateProfile,
} from "../controllers/userControllers.js";
import { verifyUserAuth } from "../middleware/userAuth.js";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logout);
router.route("/forgot/password").post(resetPasswordRequest);
router.route("/reset/:token").post(resetPassword);
router.route("/profile").get(verifyUserAuth, getUserDetails);
router.route("/update/password").post(verifyUserAuth, updatePassword);
router.route("/profile/update").put(verifyUserAuth, updateProfile);

export default router;
