import Product from "../models/productModel.js";
import HandleError from "../utils/handleError.js";
import APIFunctionality from "../utils/apiFunctionality.js";
import wrapAsyncError from "../middleware/wrapAsyncError.js";

//creating products (C)
export const createProducts = wrapAsyncError(async (req, res, next) => {
  req.body.user = req.user.id; //from token
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

//get products (R)
export const getAllProducts = wrapAsyncError(async (req, res, next) => {
  const resultPerPage = 3;
  const apiFunctionality = new APIFunctionality(Product.find(), req.query)
    .search()
    .filter();

  // pagination on filtered products - based on category etc
  const filteredQuery = apiFunctionality.query.clone();
  const productCnt = await filteredQuery.countDocuments();
  const totalPages = Math.ceil(productCnt / resultPerPage);
  const page = Number(req.query.page) || 1;
  if (page > totalPages && productCnt > 0) {
    return next(new HandleError("This page does not exist", 404));
  }

  apiFunctionality.pagination(resultPerPage);

  const products = await apiFunctionality.query;
  if (!products) {
    return next(new HandleError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    products,
    resultPerPage,
    productCnt,
    totalPages,
    currentPage: page,
  });
});

//update product (U)
export const updateProduct = wrapAsyncError(async (req, res, next) => {
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
export const deleteProduct = wrapAsyncError(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new HandleError("Product Not Found", 404));
  }
  res
    .status(200)
    .json({ success: true, message: "Product is deleted successfully." });
});

//get single Product
export const getSingleProduct = wrapAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new HandleError("Product Not Found", 404));
  }
  res.status(200).json({ success: true, product });
});

//admin - get all products
export const getAdminProducts = wrapAsyncError(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({ success: true, products });
});
