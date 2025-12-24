import express from "express";
import {
  allMyOrders,
  createOrder,
  getOrderDetails,
} from "../controllers/orderControllers.js";
import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";

const router = express.Router();

router.route("/new/order").post(verifyUserAuth, createOrder);

router
  .route("/admin/order/:id")
  .get(verifyUserAuth, roleBasedAccess("admin"), getOrderDetails);

router.route("/order/user").get(verifyUserAuth, allMyOrders);
export default router;
