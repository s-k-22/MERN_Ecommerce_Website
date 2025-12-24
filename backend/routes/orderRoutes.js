import express from "express";
import {
  allMyOrders,
  createOrder,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
} from "../controllers/orderControllers.js";
import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";

const router = express.Router();

router.route("/new/order").post(verifyUserAuth, createOrder);

router
  .route("/admin/order/:id")
  .get(verifyUserAuth, roleBasedAccess("admin"), getOrderDetails)
  .put(verifyUserAuth, roleBasedAccess("admin"), updateOrderStatus);

router.route("/orders/user").get(verifyUserAuth, allMyOrders);

router
  .route("/admin/orders")
  .get(verifyUserAuth, roleBasedAccess("admin"), getAllOrders);

export default router;
