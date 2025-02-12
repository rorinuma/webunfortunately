const { WebSocketServer } = require("ws");

let wss = null;

const InitializeWebSocket = (server) => {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    ws.send(
      JSON.stringify({ type: "WELCOME", message: "connected to tweet updates" })
    );

    ws.on("message", (message) => {
      console.log("Received:", message.toString());
    });
  });
  console.log("websocket server initialized");
};

const notifyNewTweet = () => {
  if (wss) {
    console.log("balls? does it even fucking work");
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        console.log("does it even fucking work 2");
        client.send(JSON.stringify({ type: "NEW_TWEET_AVAILABLE" }));
      }
    });
  }
};

module.exports = { InitializeWebSocket, notifyNewTweet };
