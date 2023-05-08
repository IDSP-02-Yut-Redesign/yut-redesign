const router = require('express').Router();
const questionsHandler = require("../questionsHandler.js");

router.get("/", (req, res) =>{
    res.sendFile("index.html");
});

module.exports = router;