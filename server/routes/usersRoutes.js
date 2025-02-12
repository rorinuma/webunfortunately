const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const { authorization } = require("../middleware/authMiddleware");

router.get("/:username", authorization, usersController.getProfileInfo);

module.exports = router;
