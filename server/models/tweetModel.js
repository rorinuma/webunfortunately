const pool = require("../config/db");

// Create a tweet or update replies count if it's a reply
exports.createTweet = async (userId, username, tweetId, text, image) => {
  if (tweetId) {
    await pool.query("UPDATE tweets SET replies = replies + 1 WHERE id = $1", [
      tweetId,
    ]);
  } else tweetId = null;

  const query = `
    INSERT INTO tweets (user_id, username, at, reply_to, text, image) 
    VALUES ($1, $2, $3, $4, $5, $6)
  `;
  await pool.query(query, [userId, username, username, tweetId, text, image]);
};

// Fetch tweets (all or replies to a specific tweet)
exports.allTweets = async (id, limit, offset) => {
  let query;
  let params;

  if (id) {
    query = `
      SELECT * FROM tweets 
      WHERE reply_to = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    params = [id, limit, offset];
  } else {
    query = `
      SELECT * FROM tweets 
      WHERE reply_to IS NULL 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    params = [limit, offset];
  }

  const { rows } = await pool.query(query, params);
  return rows;
};

// Fetch tweets liked by a user
exports.likedTweets = async (userId, limit, offset) => {
  const query = `
    SELECT tweets.* 
    FROM likes 
    JOIN tweets ON likes.tweet_id = tweets.id 
    WHERE likes.user_id = $1 
    ORDER BY tweets.created_at DESC 
    LIMIT $2 OFFSET $3
  `;

  const { rows } = await pool.query(query, [userId, limit, offset]);
  return rows;
};

// Fetch tweets by username
exports.tweetsByUsername = async (username, limit, offset) => {
  let query;
  let params;

  if (limit) {
    query = `
      SELECT * FROM tweets 
      WHERE username = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    params = [username, limit, offset];
  } else {
    query = `
      SELECT * FROM tweets 
      WHERE username = $1 
      ORDER BY created_at DESC
    `;
    params = [username];
  }

  const { rows } = await pool.query(query, params);
  return rows;
};

// Fetch tweets by a list of tweet IDs
exports.likedTweetsByTweetIds = async (tweetIds) => {
  if (!Array.isArray(tweetIds) || tweetIds.length === 0) {
    return [];
  }

  const placeholders = tweetIds.map((_, i) => `$${i + 1}`).join(",");
  const query = `SELECT * FROM tweets WHERE id IN (${placeholders}) ORDER BY created_at DESC`;

  const { rows } = await pool.query(query, tweetIds);
  return rows;
};

// Toggle action (like/retweet) on a tweet
exports.toggleAction = async (actionType, tweetId, userId) => {
  // Validate column name to prevent SQL injection
  const allowedActions = ["likes", "retweets"];
  if (!allowedActions.includes(actionType)) {
    throw new Error("Invalid action type");
  }

  // Check if the action already exists
  const checkQuery = `SELECT * FROM ${actionType} WHERE tweet_id = $1 AND user_id = $2`;
  const { rows: existingAction } = await pool.query(checkQuery, [tweetId, userId]);

  if (existingAction.length === 0) {
    // Add action
    const addQuery = `INSERT INTO ${actionType} (tweet_id, user_id) VALUES ($1, $2)`;
    await pool.query(addQuery, [tweetId, userId]);

    // Update tweet count
    const updateQuery = `UPDATE tweets SET ${actionType} = ${actionType} + 1 WHERE id = $1`;
    await pool.query(updateQuery, [tweetId]);

    return { message: "Action added" };
  } else {
    // Remove action
    const removeQuery = `DELETE FROM ${actionType} WHERE tweet_id = $1 AND user_id = $2`;
    await pool.query(removeQuery, [tweetId, userId]);

    // Decrease tweet count
    const updateQuery = `UPDATE tweets SET ${actionType} = ${actionType} - 1 WHERE id = $1`;
    await pool.query(updateQuery, [tweetId]);

    return { message: "Action removed" };
  }
};

// Fetch a single tweet by its ID
exports.tweetByStatusNumber = async (statusNumber) => {
  const query = "SELECT * FROM tweets WHERE id = $1";
  const { rows } = await pool.query(query, [statusNumber]);
  return rows;
};

// Create a reply to a tweet
exports.createReply = async (userId, tweetId, text, image) => {
  const query = `
    INSERT INTO tweet_replies (user_id, tweet_id, reply_text, reply_image) 
    VALUES ($1, $2, $3, $4)
  `;
  await pool.query(query, [userId, tweetId, text, image]);

  const updateQuery = "UPDATE tweets SET replies = replies + 1 WHERE id = $1";
  await pool.query(updateQuery, [tweetId]);
};

