const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authorization } = require("../middleware/authMiddleware");
const passport = require("passport");

router.post("/signup", authController.registerUser);
router.get("/login", authController.loginUser);
router.get("/logout", authController.logoutUser);
router.get("/protected", authorization, authController.protected);
router.get("/check-phone", authController.checkPhone);
router.get("/check-email", authController.checkEmail);
router.get("/check-login", authController.checkLogin);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173",
    session: false,
  }),
  authController.googleCallback
);

module.exports = router;
