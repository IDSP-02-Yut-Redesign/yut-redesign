require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const router = require("./routes/router.js");
const triviaRouter = require("./routes/minigames/trivia.js");
const scoreRouter = require("./routes/score/score.js");

const app = express();
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

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
