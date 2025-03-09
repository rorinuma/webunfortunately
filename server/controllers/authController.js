const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    let { email, username, phone, password, birthday } = req.body;

    if (!email) email = null;
    if (!phone) phone = null;

    const existingUser = await userModel.findUser(username, email);

    if (existingUser > 0) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    await userModel.createUser(email, username, password, phone, birthday);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during registration" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { inputName, password } = req.query.data;

    let userDataType;

    if (inputName) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const phoneRegex =
        /^\+?[1-9]\d{0,2}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
      if (emailRegex.test(inputName)) {
        userDataType = "email";
      } else if (phoneRegex.test(inputName)) {
        userDataType = "phone_number";
      } else {
        userDataType = "username";
      }
    }
    const users = await userModel.findUserCustom(
      userDataType,
      inputName,
      password
    );

    if (users.length === 0 || users[0].password !== password) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: users[0].id, username: users[0].username },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during login" });
  }
};

exports.logoutUser = (req, res) => {
  res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Logged out successfully" });
};

exports.protected = (req, res) => {
  res
    .status(200)
    .json({ user: { id: req.user.userId, username: req.user.username } });
};

exports.checkPhone = async (req, res) => {
  try {
    const phone = req.query.phone;

    const check = await userModel.checkPhone(phone);

    if (check.length > 0) {
      res.status(409).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("error occured while checking the phone", error);
    res.status(500).json({ error: "error occured while checking the phone" });
  }
};

exports.checkEmail = async (req, res) => {
  try {
    const email = req.query.email;

    const check = await userModel.checkEmail(email);

    console.log(check);
    if (check.length > 0) {
      res.status(409).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("error occured while checking the email", error);
    res.status(500).json({ error: "error occured while checking the email" });
  }
};

exports.checkLogin = async (req, res) => {
  try {
    const userData = req.query.data;
    let userDataType;
    if (userData) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const phoneRegex =
        /^\+?[1-9]\d{0,2}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
      if (emailRegex.test(userData)) {
        userDataType = "email";
      } else if (phoneRegex.test(userData)) {
        userDataType = "phone_number";
      } else {
        userDataType = "username";
      }
    }

    const check = await userModel.checkLogin(userDataType, userData);

    if (check.length > 0) {
      console.log(check[0]);
      res.status(200).json(check[0]);
    } else {
      res.status(400).json({ error: "user not found" });
    }
  } catch (error) {
    console.error("error occured while checking login info", error);
    res.status(500).json({ error: "error occured while checking login info" });
  }
};

exports.googleCallback = async (req, res) => {
  try {
    const token = jwt.sign(
      { userId: req.user.id, username: req.user.username },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`http://localhost:5173`);
  } catch (err) {
    console.error("Error generating JWT", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
