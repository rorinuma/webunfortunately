const pool = require("../config/db");

exports.findUser = async (username, email) => {
  const query = "select * from users where username = $1 or email = $2";
  const { rows } = await pool.query(query, [username, email]);
  return rows;
};

exports.findUserGoogle = async (googleId) => {
  const query = "select * from users where google_id = $1";
  const { rows } = await pool.query(query, [googleId]);
  return rows;
};

exports.createUser = async (email, username, password, phone, birthday) => {
  const query =
    `insert into users (email, username, "at", password,  phone_number, birthday ) values ($1, $2, $3, $4, $5, $6)`;
  await pool.query(query, [
    email,
    username,
    username,
    password,
    phone,
    birthday,
  ]);
};

exports.createUserGoogle = async (email, username, googleId) => {
  const query =
    "insert into users (email, username, google_id) values ($1, $2, $3)";
  await pool.query(query, [email, username, googleId]);
};

exports.checkPhone = async (phone) => {
  const query = "select * from users where phone_number = $1";
  const { rows } = await pool.query(query, [phone]);
  return rows;
};

exports.checkEmail = async (email) => {
  const query = "select * from users where email = $1";
  const { rows } = await pool.query(query, [email])
  return rows;
};

exports.checkLogin = async (userDataType, userData) => {
  const query = `SELECT ${userDataType} FROM users WHERE ${userDataType} = $1`;
  const { rows } = await pool.query(query, [userData]);
  return rows;
};

// when the column has to be specified
exports.findUserCustom = async (dataType, data, password) => {
  const query = `select * from users where ${dataType} = $1 and password = $2`;
  const { rows } = await pool.query(query, [data, password]);
  return rows;
};
