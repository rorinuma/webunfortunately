const db = require("../config/db");

exports.createTweet = async (userId, username, text, date, image) => {
  const query = "INSERT INTO tweets (userId, username, at, text, date, image) VALUES (?, ?, ?, ?, ?, ?)";
  await db.execute(query, [userId, username, username, text, date, image]);
};

exports.getAllTweets = async () => {
  const query = "SELECT * FROM tweets ORDER BY date DESC";
  const [tweets] = await db.execute(query);
  return tweets;
};

exports.getLikedTweets = async (userId) => {
  const query = "SELECT * FROM likes WHERE user_id = ?";
  const [tweets] = await db.execute(query, [userId]);
  return tweets;
};

exports.getTweetsByUsername = async (username) => {
  const query = "select * from tweets where username = ? order by date desc"
  const [tweets] = await db.execute(query, [username])
  return tweets
}

exports.getLikedTweetsByTweetIds = async (tweetIds) => {
    if (!Array.isArray(tweetIds) || tweetIds.length === 0) {
      return []; 
    }
  
    const placeholders = tweetIds.map(() => '?').join(',');
    const query = `SELECT * FROM tweets WHERE id IN (${placeholders}) order by date desc`;
    
    try {
      const [tweets] = await db.execute(query, tweetIds);
      return tweets;
    } catch (error) {
      console.error("Error fetching liked tweets:", error);
      throw new Error("Database query failed");
    }
  };
  

exports.toggleLike = async (tweetId, userId) => {
  const checkQuery = "select * from likes where tweet_id = ? and user_id = ?"
  const [ existingLikes ] = await db.execute(checkQuery, [tweetId, userId])

    if (existingLikes.length === 0) {
      const addQuery = "insert into likes (tweet_id, user_id) values (?, ?)";
      await db.execute(addQuery, [tweetId, userId])

      const updateLikes = "update tweets set likes = likes + 1 where id = ?"
      await db.execute(updateLikes, [tweetId]);

      return({message: 'Like added'})
    } else {
      const removeQuery = "delete from likes where tweet_id = ? and user_id = ?"
      await db.execute(removeQuery, [tweetId, userId]);

      const updateLikes = "update tweets set likes = likes - 1 where id = ?"
      await db.execute(updateLikes, [tweetId]);

      return({message: "Like removed"})
    }
};

