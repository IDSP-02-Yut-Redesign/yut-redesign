require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path');
const router = require('./routes/router.js');
const triviaRouter = require('./routes/minigames/trivia.js');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const PORT = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", router);
app.use("/trivia", triviaRouter);

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.join("room-1");
  
    socket.on("diceRolled", (data) => {
      console.log("Dice rolled by", data.player, "Number:", data.diceNumber);
  
      // Broadcast the dice roll to all other connected clients in the room, except the sender
      socket.broadcast.to("room-1").emit("diceRolled", data);
    });
  
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
});

httpServer.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));