const express = require("express");
const bodyParser = require("body-parser");
const events = require("events");

const app = express();
const port = 3000;
const messageEventEmitter = new events.EventEmitter();

app.use(bodyParser.json());

app.get("/messages", (req, res) => {
  console.log("Waiting for new messages...");

  // Set headers for server-sent events
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  // Remove above for long polling only

  // For long polling only
  // messageEventEmitter.once("newMessage", (message) => {
  //   console.log("Message received:", message);
  //   res.json({ message });
  // });

  // For server-sent events
  messageEventEmitter.on("newMessage", (message) => {
    console.log("Message received:", message);
    res.write(`data: ${JSON.stringify({ message })}\n\n`);
  });
});

app.post("/new-message", (req, res) => {
  const { message } = req.body;
  console.log("New message:", message);
  messageEventEmitter.emit("newMessage", message);
  res.json({ status: "Message sent" });
});

app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
