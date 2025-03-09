const db = require("../config/db");

exports.findUser = async (username, email) => {
  const query = "select * from users where username = ? or email = ?";
  const [result] = await db.execute(query, [username, email]);
  return result;
};

exports.findUserGoogle = async (googleId) => {
  const query = "select * from users where google_id = ?";
  const [result] = await db.execute(query, [googleId]);
  return result;
};

exports.createUser = async (email, username, password, phone, birthday) => {
  const query =
    "insert into users (email, username, at, password,  phone_number, birthday ) values (?, ?, ?, ?, ?, ?)";
  await db.execute(query, [
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
    "insert into users (email, username, google_id) values (?, ?, ?)";
  await db.execute(query, [email, username, googleId]);
};

exports.checkPhone = async (phone) => {
  const query = "select * from users where phone_number = ?";
  const [result] = await db.execute(query, [phone]);
  return result;
};

exports.checkEmail = async (email) => {
  const query = "select * from users where email = ?";
  const [result] = await db.execute(query, [email]);
  return result;
};

exports.checkLogin = async (userDataType, userData) => {
  const query = "select ?? from users where ?? = ?";
  const [result] = await db.query(query, [
    userDataType,
    userDataType,
    userData,
  ]);
  return result;
};

// when the column has to be specified
exports.findUserCustom = async (dataType, data, password) => {
  const query = "select * from users where ?? = ? and password = ?";
  console.log(dataType, data, password);
  const [result] = await db.query(query, [dataType, data, password]);
  return result;
};
