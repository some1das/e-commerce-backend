
const express = require("express");
const router = express.Router();

const {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  removeCategory
} = require("../controllers/category");
const {
  isAdmain,
  isAuthenticated,
  isSignedIn,
} = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//Parameters are here
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//Actual routs are here
//Create routes
router.post(
  "/category/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmain,
  createCategory
);
//Read routes
router.get("/category/:categoryId", getCategory);
router.get("/categories/", getAllCategories);
//Update
router.put(
    "/category/categoryId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmain,
    updateCategory
  );
//Delete routes
router.delete(
    "/category/:categoryId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmain,
    removeCategory
  );

module.exports = router;
