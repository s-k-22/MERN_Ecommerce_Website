import express from "express";
import {
  createOrder,
  getOrderDetails,
} from "../controllers/orderControllers.js";
import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";

const router = express.Router();

router.route("/new/order").post(verifyUserAuth, createOrder);

router
  .route("/admin/order/:id")
  .get(verifyUserAuth, roleBasedAccess("admin"), getOrderDetails);

export default router;
