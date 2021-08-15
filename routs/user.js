const express = require("express")
const router = express.Router()

const { getUserById, getUser, updateUser, userPurchaseList, getAllTheUsers, updateRole } = require('../controllers/user')
const { isSignedIn, isAuthenticated, isAdmain } = require('../controllers/auth')
const user = require("../models/user")

router.param("userId", getUserById)
router.get('/user/:userId', isSignedIn, isAuthenticated, getUser)
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser)
router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList)
router.get("/users/all/:userId", isSignedIn, isAuthenticated, isAdmain, getAllTheUsers)
router.put("/user/changeRole/:userId", isSignedIn, isAuthenticated, isAdmain, updateRole)



module.exports = router