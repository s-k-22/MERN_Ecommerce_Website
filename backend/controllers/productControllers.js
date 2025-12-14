import Product from "../models/productModel.js";
import HandleError from "../utils/handleError.js";
import wrapAsync from "../middleware/wrapAsyncError.js";
import APIFunctionality from "../utils/apiFunctionality.js";

//creating products (C)
export const createProducts = wrapAsync(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

//get products (R)
export const getAllProducts = wrapAsync(async (req, res, next) => {
  const apiFunctionality = new APIFunctionality(Product.find(), req.query)
    .search()
    .filter();

  const products = await apiFunctionality.query;

  res.status(200).json({ success: true, products });
});

//update product (U)
export const updateProduct = wrapAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    // res.status(500).json({ success: false, message: "Product Not Found" });
    return next(new HandleError("Product Not Found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

//delete product (D)
export const deleteProduct = wrapAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new HandleError("Product Not Found", 404));
  }
  res
    .status(200)
    .json({ success: true, message: "Product is deleted successfully." });
});

//get single Product
export const getSingleProduct = wrapAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new HandleError("Product Not Found", 404));
  }
  res.status(200).json({ success: true, product });
});
