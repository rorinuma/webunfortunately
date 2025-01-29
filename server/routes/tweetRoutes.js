const express = require("express");
const router = express.Router();
const tweetController = require("../controllers/tweetController");
const { authorization } = require("../middleware/authMiddleware");
const upload = require('../config/multer')


router.post("/", authorization, upload.single("tweet_post_image"), tweetController.createTweet);
router.get("/all", authorization, tweetController.getAllTweets);
router.get('/posts', authorization, tweetController.getProfileTweets)
router.get('/liked', authorization, tweetController.getLikedTweetsByUsername)
router.put("/likes", authorization, tweetController.likeTweet)
router.get('/:username/status/:statusNumber', authorization, tweetController.getTweetInfoByStatus)


module.exports = router;
