const db = require("../config/db");

exports.createTweet = async (userId, username, tweetId, text, image) => {
  if (tweetId) {
    await db.execute("update tweets set replies = replies + 1 where id = ?", [
      tweetId,
    ]);
  } else tweetId = null;
  const query =
    "INSERT INTO tweets (user_id, username, at, reply_to, text, image) VALUES (?, ?, ?, ?, ?, ?)";
  await db.execute(query, [userId, username, username, tweetId, text, image]);
};

exports.allTweets = async (id, limit, offset) => {
  if (id) {
    const query =
      "select * from tweets where reply_to = ? order by created_at desc limit ? offset ?";
    const [tweets] = await db.query(query, [id, limit, offset]);
    return tweets;
  } else {
    const query =
      "SELECT * FROM tweets WHERE reply_to IS NULL ORDER BY created_at DESC limit ? offset ?";
    const [tweets] = await db.query(query, [limit, offset]);
    return tweets;
  }
};

exports.likedTweets = async (userId, limit, offset) => {
  if (limit) {
    const query =
      "select likes.* from likes join users on likes.user_id = users.id where users.username = ? limit ? offset ?";
    const [tweets] = await db.query(query, [userId, limit, offset]);
    return tweets;
  }
  const query = "SELECT * FROM likes WHERE user_id = ?";
  const [tweets] = await db.execute(query, [userId]);
  return tweets;
};

exports.tweetsByUsername = async (username, limit, offset) => {
  if (limit) {
    const query =
      "select * from tweets where username = ? order by created_at desc limit ? offset ?";
    const [tweets] = await db.query(query, [username, limit, offset]);
    return tweets;
  }
  const query =
    "select * from tweets where username = ? order by created_at desc";
  const [tweets] = await db.execute(query, [username]);
  return tweets;
};

exports.likedTweetsByTweetIds = async (tweetIds) => {
  if (!Array.isArray(tweetIds) || tweetIds.length === 0) {
    return [];
  }

  const placeholders = tweetIds.map(() => "?").join(",");
  const query = `SELECT * FROM tweets WHERE id IN (${placeholders}) order by created_at desc`;

  try {
    const [tweets] = await db.execute(query, tweetIds);
    return tweets;
  } catch (error) {
    console.error("Error fetching liked tweets:", error);
    throw new Error("Database query failed");
  }
};

exports.toggleLike = async (tweetId, userId) => {
  const checkQuery = "select * from likes where tweet_id = ? and user_id = ?";
  const [existingLikes] = await db.execute(checkQuery, [tweetId, userId]);

  if (existingLikes.length === 0) {
    const addQuery = "insert into likes (tweet_id, user_id) values (?, ?)";
    await db.execute(addQuery, [tweetId, userId]);

    const updateLikes = "update tweets set likes = likes + 1 where id = ?";
    await db.execute(updateLikes, [tweetId]);

    return { message: "Like added" };
  } else {
    const removeQuery = "delete from likes where tweet_id = ? and user_id = ?";
    await db.execute(removeQuery, [tweetId, userId]);

    const updateLikes = "update tweets set likes = likes - 1 where id = ?";
    await db.execute(updateLikes, [tweetId]);

    return { message: "Like removed" };
  }
};

exports.tweetByStatusNumber = async (statusNumber) => {
  const query = "select * from tweets where id = ?";
  const [tweet] = await db.execute(query, [statusNumber]);
  return tweet;
};

exports.createReply = async (userId, tweetId, text, image) => {
  const query =
    "insert into tweet_replies (user_id, tweet_id, reply_text, reply_image) values (?, ?, ?, ?)";
  await db.execute(query, [userId, tweetId, text, image]);
  const updateQuery = "update tweets set replies = replies + 1 where id = ?";
  await db.execute(updateQuery, [tweetId]);
};
