const db = require("../config/db")

exports.findUser = async (username, email) => {
  const query = "select * from users where username = ? or email = ?";
  const [result] = await db.execute(query, [username, email]);
  return result
}

exports.createUser = async (email, username, password) => {
  const query = "insert into users (email, username, at, password) values (?, ?, ?, ?)";
  await db.execute(query, [email, username, username, password])
}

