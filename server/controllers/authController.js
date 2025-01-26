const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")

exports.registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body
    const existingUser = await userModel.findUser(username, email)

    if(existingUser > 0) {
      return res.status(400).json({error: "Username or email already exists"})
    }

    await userModel.createUser(email, username, password)

    res.status(201).json({message: "User registered successfully"})
  } catch (error) {
    console.error(error)
    res.status(500).json({error: "Server error during registration"})
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body
    const users = await userModel.findUser(username, username)

    if (users.length === 0 || users[0].password !== password) {
      res.status(401).json({error: "Invalid credentials"})
    }

    const token = jwt.sign({userId: users[0].id, username }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    })

    res.cookie('access_token', token, {httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000})
    res.status(200).json({message: "Login successful"});
  } catch (error) {
    console.error(error)
    res.status(500).json({error: "Server error during login"});
  }
}

exports.logoutUser = (req, res) => {
  res.clearCookie("access_token").status(200).json({message: "Logged out successfully"});
}

exports.protected = (req, res) => {
  res.status(200).json({user: {id: req.user.userId, username: req.user.username}})
}