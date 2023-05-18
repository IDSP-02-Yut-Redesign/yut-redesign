require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const router = require("./routes/router.js");
const triviaRouter = require("./routes/minigames/trivia.js");
const scoreRouter = require("./routes/scores/score.js");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", router);
app.use("/trivia", triviaRouter);
app.use("/scores", scoreRouter);

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
