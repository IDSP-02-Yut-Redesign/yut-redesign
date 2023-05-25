require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const path = require("path");
const router = require("./routes/router.js");
const triviaRouter = require("./routes/minigames/trivia.js");
const scoreRouter = require("./routes/score/score.js");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const PORT = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", router);
app.use("/trivia", triviaRouter);
app.use("/score", scoreRouter);

// create session
app.post("/set-username", (req, res) => {
  req.session.username = req.body.username;
  res.send({ status: "OK" });
});

io.on("connection", (socket) => {
  socket.join("room-1");
  console.log("a user connected");

  socket.on("moveUserMarker", (data) => {
    console.log("Dice rolled by", data.currentMarker, "Number:", data.newPos);

    // Broadcast the dice roll to all other connected clients in the room, except the sender
    socket.broadcast.to("room-1").emit("moveUserMarker", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

httpServer.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
