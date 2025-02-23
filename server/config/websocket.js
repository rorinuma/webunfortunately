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
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ type: "NEW_TWEET_AVAILABLE" }));
      }
    });
  }
};

module.exports = { InitializeWebSocket, notifyNewTweet };
