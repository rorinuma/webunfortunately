exports.transformTweets = (tweets, likedTweets) => {
  return tweets.map((tweet) => ({
    ...tweet,
    image: tweet.image? `http://localhost:8080/uploads/${tweet.image}` : null,
    liked: likedTweets.some(like => like.tweet_id === tweet.id) ? true : false
  }))
}