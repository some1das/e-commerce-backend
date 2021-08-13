const express = require("express");
const router = express.Router();

const {
  isAdmain,
  isAuthenticated,
  isSignedIn,
} = require("../controllers/auth");
const { getUserById, pushOderInPurchaseList } = require("../controllers/user");
const {
  getOrderById,
  createOrder,
  getAllOrders,
  getOrderStatus,
  updateStatus,
  singleOrderDetails,
  getOrdersOfTheUser
} = require("../controllers/order");
const { updateStocks } = require("../controllers/product");
//Params
router.param("userId", getUserById);
router.param("orderId", getOrderById);
//Actual Routes
//Create Routes
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  createOrder
);
//Read Routes
router.get(
  "/order/all/:userId",
  // isSignedIn,
  // isAuthenticated,
  // isAdmain,
  getAllOrders
);
router.get("/orders/:userId", getOrdersOfTheUser)
router.get("/order/:userId/:orderId", isSignedIn, isAuthenticated, isAdmain, singleOrderDetails)
router.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmain, getOrderStatus)
router.put("/order/:orderId/status/:userId", isSignedIn, isAuthenticated, isAdmain, updateStatus)
module.exports = router;
