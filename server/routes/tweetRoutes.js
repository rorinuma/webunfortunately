const express = require("express");
const router = express.Router();
const tweetController = require("../controllers/tweetController");
const { authorization } = require("../middleware/authMiddleware");
const upload = require("../config/multer");

router.post(
  "/",
  authorization,
  upload.single("tweet_post_image"),
  tweetController.createTweet
);
router.get("/all", authorization, tweetController.allTweets);
router.get("/posts", authorization, tweetController.profileTweets);
router.get("/liked", authorization, tweetController.profileLikedTweets);
router.put("/action", authorization, tweetController.tweetAction);
router.get(
  "/:username/status/:statusNumber",
  authorization,
  tweetController.tweetInfoByStatus
);

module.exports = router;
