const express = require("express");
const bodyParser = require("body-parser");
const events = require("events");

const app = express();
const port = 3000;
const messageEventEmitter = new events.EventEmitter();

app.use(bodyParser.json());

app.get("/messages", (req, res) => {
  console.log("Waiting for new messages...");
  messageEventEmitter.once("newMessage", (message) => {
    console.log("Message received:", message);
    res.json({ message });
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
