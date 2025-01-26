const jwt = require("jsonwebtoken");

exports.authorization = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(403).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = {
      id: decoded.userId,
      username: decoded.username
    }
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};
