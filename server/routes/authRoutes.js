const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authorization } = require("../middleware/authMiddleware");

router.post("/register", authController.registerUser);
router.get("/login", authController.loginUser);
router.get("/logout", authController.logoutUser);
router.get('/protected', authorization, authController.protected)
router.get('/check-phone', authController.checkPhone)
router.get('/check-email', authController.checkEmail)
router.get('/check-login', authController.checkLogin)



module.exports = router;
