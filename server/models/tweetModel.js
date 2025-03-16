const pool = require("../config/db");

// Create a tweet or update replies count if it's a reply (tweetId exists = reply)
exports.createTweet = async (userId, username, tweetId, text, image, actionTableName) => {
  if (tweetId) {
    await pool.query(`UPDATE tweets SET ${actionTableName} = ${actionTableName} + 1 WHERE id = $1`, [
      tweetId,
    ]);
  } else {
    tweetId = null;
  }
  let query
  if (actionTableName === "replies") {
    query = `
      INSERT INTO tweets (user_id, username, at, reply_to, text, image) 
      VALUES ($1, $2, $3, $4, $5, $6) 
    `;
  } else if (actionTableName === "retweets") {
    query = `
      INSERT INTO tweets (user_id, username, at, quote_to, text, image)
      VALUES ($1, $2, $3, $4, $5, $6)
    `
  }

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
      WHERE reply_to is NULL
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

exports.profileLikedTweets = async (username, limit, offset) => {
  // i don't understand how this query works, like at all
  const query = `
    SELECT tweets.*
    FROM tweets
    JOIN likes ON tweets.id = likes.tweet_id
    JOIN users ON likes.user_id = users.id
    WHERE users.username = $1
    LIMIT $2 OFFSET $3
  `
  const { rows } = await pool.query(query, [username, limit, offset]);
  return rows;
}

exports.retweetedTweets = async (userId, limit, offset) => {
  const query = `
    SELECT tweets.* 
    FROM retweets 
    JOIN tweets ON retweets.tweet_id = tweets.id 
    WHERE retweets.user_id = $1 
    ORDER BY tweets.created_at DESC 
    LIMIT $2 OFFSET $3
  `;

  const { rows } = await pool.query(query, [userId, limit, offset]);
  return rows;
};

exports.viewedTweets = async (userId, limit, offset) => {
  const query = `
    SELECT tweets.* 
    FROM views 
    JOIN tweets ON views.tweet_id = tweets.id 
    WHERE views.user_id = $1 
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

exports.toggleAction = async (actionType, tweetId, userId) => {
  const allowedActions = ["likes", "retweets", "views"];
  if (!allowedActions.includes(actionType)) {
    console.error("Invalid action type");
    return
  }
  // if its only a retweet we for sure know that the retweet_type is retweet
  // so we have to insert the "retweet" retweet_type
  const checkQuery = `SELECT * FROM ${actionType} WHERE tweet_id = $1 AND user_id = $2`;
  const { rows: existingAction } = await pool.query(checkQuery, [
    tweetId,
    userId,
  ]);
  if (existingAction.length > 0 && actionType === "views")
    return { message: "Tweet already viewed" };
  if (existingAction.length === 0) {
    // Add action
    if (actionType === "retweets") {
      const addQuery = "INSERT INTO retweets (tweet_id, user_id, retweet_type) VALUES ($1, $2, $3)"
      await pool.query(addQuery, [tweetId, userId, "retweet"])
    } else {
      const addQuery = `INSERT INTO ${actionType} (tweet_id, user_id) VALUES ($1, $2)`;
      await pool.query(addQuery, [tweetId, userId]);
    }
    // Update tweet count
    const updateQuery = `UPDATE tweets SET ${actionType} = ${actionType} + 1 WHERE id = $1`;
    await pool.query(updateQuery, [tweetId]);

    return { message: "Action added" };
  } else {
    // Remove action
    if (actionType === "retweets") {
      const removeQuery = "DELETE FROM retweets WHERE tweet_id = $1 AND user_id = $2 AND retweet_type = $3"
      await pool.query(removeQuery, [tweetId, userId, retweet])
    } else {

      const removeQuery = `DELETE FROM ${actionType} WHERE tweet_id = $1 AND user_id = $2`;
      await pool.query(removeQuery, [tweetId, userId]);
    }
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
