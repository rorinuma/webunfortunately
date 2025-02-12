const express = require("express");
const app = express();
const corsOptions = require("./config/cors");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const { createServer } = require("http");
const { InitializeWebSocket } = require("./config/websocket");
const tweetRoutes = require("./routes/tweetRoutes");
const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/usersRoutes");

const server = createServer(app);

InitializeWebSocket(server);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/api/tweets", tweetRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

server.listen(8080, () => {
  console.log("Server started on port 8080");
});
