import wrapAsyncError from "../middleware/wrapAsyncError.js";
import HandleError from "../utils/handleError.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

export const createOrder = wrapAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({ success: true, order });
});

export const getOrderDetails = wrapAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new HandleError("order not found", 400));
  }
  res.status(200).json({ success: true, order });
});

//logged in user - get all orders
export const allMyOrders = wrapAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json({ success: true, orders });
});

//admin - get all the orders
export const getAllOrders = wrapAsyncError(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;
  orders.forEach((order) => (totalAmount += order.totalPrice));
  res.status(200).json({ success: true, orders, totalAmount });
});

//admin - get all the orders
export const updateOrderStatus = wrapAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new HandleError("order not found", 400));
  }

  if (order.orderStatus == "Delivered") {
    return next(new HandleError("order is already been delivered", 404));
  }

  await Promise.all(
    order.orderItems.map((item) => updateQuantity(item.product, item.quantity))
  );

  order.orderStatus = req.body.status;
  if (order.orderStatus === "Delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });
  res.status(200).json({ success: true });
});

//admin - update stock
async function updateQuantity(id, quantity) {
  const product = await Product.findById(id);
  if (!product) {
    return next(new HandleError("product not found", 404));
  }
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

//delete order
export const deleteOrder = wrapAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new HandleError("order not found", 404));
  }
  if (order.orderStatus !== "Delivered") {
    return next(
      new HandleError("This order is under processing.Cannot be deleted", 404)
    );
  }
  await Order.deleteOne({ _id: req.params.id });
  res
    .status(200)
    .json({ success: true, message: "order deleted successfully" });
});
