import express from "express";
import {
  loginUser,
  logout,
  registerUser,
  resetPasswordRequest,
} from "../controllers/userControllers.js";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logout);
router.route("/forgot/password").post(resetPasswordRequest);

export default router;
