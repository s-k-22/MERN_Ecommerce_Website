import express from "express";
import {
  createProducts,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/productControllers.js";
import { verifyUserAuth } from "../middleware/userAuth.js";
const router = express.Router();

router.route("/products").get(verifyUserAuth,getAllProducts).post(createProducts);
router
  .route("/product/:id")
  .put(updateProduct)
  .delete(deleteProduct)
  .get(getSingleProduct);

export default router;
