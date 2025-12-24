import express from "express";
import {
  getAllUsers,
  getUserDetails,
  loginUser,
  logout,
  registerUser,
  resetPassword,
  resetPasswordRequest,
  updatePassword,
  updateProfile,
  getSingleUser,
  updateUserRole,
} from "../controllers/userControllers.js";
import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logout);
router.route("/forgot/password").post(resetPasswordRequest);
router.route("/reset/:token").post(resetPassword);
router.route("/profile").get(verifyUserAuth, getUserDetails);
router.route("/update/password").post(verifyUserAuth, updatePassword);
router.route("/profile/update").put(verifyUserAuth, updateProfile);

router
  .route("/admin/users")
  .get(verifyUserAuth, roleBasedAccess("admin"), getAllUsers);

router
  .route("/admin/user/:id")
  .get(verifyUserAuth, roleBasedAccess("admin"), getSingleUser)
  .put(verifyUserAuth, roleBasedAccess("admin"), updateUserRole);

export default router;
