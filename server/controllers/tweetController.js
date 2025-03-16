const { transformTweets } = require("../utils/tweetUtils");
const tweetModel = require("../models/tweetModel");
const { notifyNewTweet } = require("../config/websocket");

exports.createTweet = async (req, res) => {
  try {
    const { text, id } = req.body;
    const image = req.file ? req.file.filename : null;
    const actionTableName = req.query.actionTableName

    await tweetModel.createTweet(
      req.user.id,
      req.user.username,
      id,
      text,
      image,
      actionTableName
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
    const page = parseInt(req.query.page);
    const limit = 10; // should be 20 but because of the strict mode
    const offset = (page - 1) * limit;
    const { statusNumber } = req.query;
    let tweets;
    if (statusNumber) {
      tweets = await tweetModel.allTweets(statusNumber, limit, offset);
    } else {
      tweets = await tweetModel.allTweets(null, limit, offset);
    }
    const updatedTweets = await transformTweets(
      tweets,
      req.user.id,
      limit,
      offset,
      statusNumber,
    );
    res.status(200).json({ tweets: updatedTweets });
  } catch (error) {
    console.error("Error fetching tweets", error);
    res.status(500).json({ error: "Error fetching tweets" });
  }
};

exports.profileLikedTweets = async (req, res) => {
  try {
    const username = req.query.username;
    const page = parseInt(req.query.page) | 1;
    const limit = 10; // should be 20 but because of the strict mode
    const offset = (page - 1) * limit;

    const tweets = await tweetModel.profileLikedTweets(username, limit, offset);

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
    const page = parseInt(req.query.page);
    const limit = 10; // should be 20 but because of the strict mode
    const offset = (page - 1) * limit;
    const username = req.query.username;

    const userTweets = await tweetModel.tweetsByUsername(
      username,
      limit,
      offset,
    );
    const updatedTweets = await transformTweets(userTweets, req.user.id, limit, offset)
    res
      .status(200)
      .json({ tweets: updatedTweets });
  } catch (error) {
    console.error("Error occured while fetching profile tweets", error);
    res.status(500).json({ error: "Error while fetching profile tweets" });
  }
};

exports.tweetAction = async (req, res) => {
  try {
    const { tweetId } = req.body;
    const tweetAction = req.query.tweetAction;
    const userId = req.user.id;

    const result = await tweetModel.toggleAction(tweetAction, tweetId, userId);
    res.status(200).json({ result });
  } catch (error) {
    console.error("An error occured while performing the tweet action", error);
    res
      .status(500)
      .json({ error: "An error occured while performing the tweet action" });
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
      liked: likedTweet.some((like) => like.id === tweet.id)
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
