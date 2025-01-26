const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authorization } = require("../middleware/authMiddleware");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/logout", authController.logoutUser);
router.get('/protected', authorization, authController.protected)

module.exports = router;
