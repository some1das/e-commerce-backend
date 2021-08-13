const express = require("express");
const router = express.Router();

const {
  isAdmain,
  isAuthenticated,
  isSignedIn,
} = require("../controllers/auth");
const {
  createProduct,
  getProductById,
  getProduct,
  photo,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getAllUniqueCategories,
  getProductDetails,
  getProductsByIdArray
} = require("../controllers/product");
const { getUserById } = require("../controllers/user");
//All params
router.param("userId", getUserById);
router.param("productId", getProductById);

//all actual routes
//Create routes
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmain,
  createProduct
);

//Read routes
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);
router.get("/products", getAllProducts)
router.get("products/categories", getAllUniqueCategories)
router.get("/singleProduct/:productId", getProductDetails)
router.post("/products/ids", getProductsByIdArray)
//update routes
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmain,
  updateProduct
);
//Delete Routes
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmain,
  deleteProduct
);


module.exports = router;
