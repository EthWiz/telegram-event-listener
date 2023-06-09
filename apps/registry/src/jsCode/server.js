const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const eventService = require('./eventService');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173' }));

app.post("/event-register/add", (req, res) => {
  const userInfo = req.body;
  const error = eventService.validateUserInfo(userInfo);
  if (error) {
    res.status(400).send(error);
    return;
  }

  eventService.addEvent(userInfo);
  res.status(200).send("User information saved successfully");
});

app.get("/event-register/list/all", (req, res) => {
  const data = eventService.listEvents();
  if (data.length === 0) {
    res.status(404).send("No register file");
    return;
  }
  res.status(200).send(data);
});

app.delete("/event-register/remove/:alertId", (req, res) => {
  const alertId = req.params.alertId;
  const success = eventService.removeEvent(alertId);

  if (!success) {
    res.status(404).send("Alert id doesn't exist");
    return;
  }

  res.status(200).send("Success!");
});

app.get("/event-register/list/:chatId?", (req, res) => {
  const chatId = parseInt(req.params.chatId);
  const data = eventService.listEventsByChatId(chatId);

  if (data.length === 0) {
    res.status(404).send("No register file");
    return;
  }
  res.status(200).send(data);
});

app.listen(3005, () => {
  console.log("Server running on port 3005");
});
