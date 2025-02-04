exports.transformTweets = (tweets, likedTweets) => {
  return tweets.map((tweet) => ({
    ...tweet,
    image: tweet.image? `http://localhost:8080/uploads/${tweet.image}` : null,
    liked: likedTweets.some(like => like.tweet_id === tweet.id) ? true : false
  }))
}

exports.getPagination = (page) => {
  const parsedPage = (parseInt(page) || 1);
  const limit = 10;
  const offset = (parsedPage - 1) * limit

  return { limit: limit, offset: offset };
}