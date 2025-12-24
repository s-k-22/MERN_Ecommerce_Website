import express from "express";
import {
  createProducts,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/productControllers.js";
import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";
const router = express.Router();

router
  .route("/products")
  .get(getAllProducts)
  .post(verifyUserAuth, roleBasedAccess("admin"), createProducts);
router
  .route("/product/:id")
  .put(verifyUserAuth, roleBasedAccess("admin"), updateProduct)
  .delete(verifyUserAuth, roleBasedAccess("admin"), deleteProduct)
  .get(getSingleProduct);

export default router;
