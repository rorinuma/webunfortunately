const { transformTweets } = require("../utils/tweetUtils");
const tweetModel = require("../models/tweetModel");
const { notifyNewTweet } = require("../config/websocket");

exports.createTweet = async (req, res) => {
  try {
    const { text, id } = req.body;
    const image = req.file ? req.file.filename : null;
    await tweetModel.createTweet(
      req.user.id,
      req.user.username,
      id,
      text,
      image
    );
    notifyNewTweet();
    res.status(201).json({ message: "Tweet posted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error posting tweet" });
  }
};

exports.allTweets = async (req, res) => {
  try {
    const statusNumber = req.query.statusNumber;
    const page = parseInt(req.query.page) | 1;
    const limit = 10; // should be 20 but because of the strict mode
    const offset = (page - 1) * limit;
    let tweets;
    if (statusNumber) {
      tweets = await tweetModel.allTweets(statusNumber, limit, offset);
    } else {
      tweets = await tweetModel.allTweets(null, limit, offset);
    }
    const likedTweets = await tweetModel.likedTweets(req.user.id);
    const updatedTweets = transformTweets(tweets, likedTweets);
    res.status(200).json({ tweets: updatedTweets });
  } catch (error) {
    console.error("Error fetching tweets", error);
    res.status(500).json({ error: "Error fetching tweets" });
  }
};

exports.likedTweets = async (req, res) => {
  try {
    const username = req.query.username;
    const page = parseInt(req.query.page) | 1;
    const limit = 10; // should be 20 but because of the strict mode
    const offset = (page - 1) * limit;

    const tweetIds = await tweetModel.likedTweets(username, limit, offset);
    const extractedIds = tweetIds.map((tweet) => tweet.tweet_id);

    const tweets = await tweetModel.likedTweetsByTweetIds(extractedIds);

    const updatedTweets = tweets.map((tweet) => ({
      ...tweet,
      image: tweet.image
        ? `http://localhost:8080/uploads/${tweet.image}`
        : null,
      liked: true,
    }));
    res.status(200).json({ tweets: updatedTweets });
  } catch (error) {
    console.error("Error while fetching liked tweets", error);
    res.status(500).json({ error: "Error while fetching liked tweets" });
  }
};

exports.profileTweets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) | 1;
    const limit = 10; // should be 20 but because of the strict mode
    const offset = (page - 1) * limit;
    const username = req.query.username;

    const userTweets = await tweetModel.tweetsByUsername(
      username,
      limit,
      offset
    );
    const likedUserTweets = await tweetModel.likedTweets(req.user.id);
    console.log(transformTweets(userTweets, likedUserTweets).length);
    res
      .status(200)
      .json({ tweets: transformTweets(userTweets, likedUserTweets) });
  } catch (error) {
    console.error("Error occured while fetching profile tweets", error);
    res.status(500).json({ error: "Error while fetching profile tweets" });
  }
};

exports.likeTweet = async (req, res) => {
  try {
    const { tweetId } = req.body;
    const userId = req.user.id;
    const result = await tweetModel.toggleLike(tweetId, userId);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "An error occured while liking the tweet." });
  }
};

exports.tweetInfoByStatus = async (req, res) => {
  try {
    const { statusNumber } = req.params;
    const tweet = await tweetModel.tweetByStatusNumber(statusNumber);
    if (tweet.length === 0)
      return res.status(401).json({ error: "Tweet not found" });
    const likedTweet = await tweetModel.likedTweets(req.user.id);
    const updatedTweet = tweet.map((tweet) => ({
      ...tweet,
      image: tweet.image
        ? `http://localhost:8080/uploads/${tweet.image}`
        : null,
      liked: likedTweet.some((like) => like.tweet_id === tweet.id)
        ? true
        : false,
    }));
    res.status(200).json({ tweet: updatedTweet });
  } catch (error) {
    console.error("Error occured while fetching tweets by status", error);
    res
      .status(500)
      .json({ error: "Error occured while fetching tweets by status" });
  }
};
