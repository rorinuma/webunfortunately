const tweetModel = require("../models/tweetModel");

exports.transformTweets = async (
  tweets,
  userId,
  limit,
  offset,
  statusNumber,
) => {
  const [likedTweets, retweetedTweets, viewedTweets] = await Promise.all([
    tweetModel.likedTweets(userId, limit, offset),
    tweetModel.retweetedTweets(userId, limit, offset),
    tweetModel.viewedTweets(userId, limit, offset),
  ]);

  return tweets.map((tweet) => ({
    ...tweet,
    image: tweet.image ? `http://localhost:8080/uploads/${tweet.image}` : null,
    liked: likedTweets.some((like) => like.tweet_id === tweet.id)
      ? true
      : false,
    retweeted: retweetedTweets.some((retweet) => retweet.tweet_id === tweet.id)
      ? true
      : false,
    viewed: viewedTweets.some((view) => view.tweet_id === tweet.id)
      ? true
      : false,
  }));
};

exports.getPagination = (page) => {
  const parsedPage = parseInt(page) || 1;
  const limit = 10;
  const offset = (parsedPage - 1) * limit;

  return { limit: limit, offset: offset };
};
