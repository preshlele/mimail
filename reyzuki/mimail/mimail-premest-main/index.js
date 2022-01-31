require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

const userRoute = require("./src/routes/user.route");
const mailRoute = require("./src/routes/mail.route");
const dbURL = process.env.DB;

mongoose.connect(dbURL, () => {
  app.listen(5000, () => {
    console.log("SERVER IS READY");
  });
});

app.use(express.json());

app.use(userRoute);
app.use(mailRoute);

app.get("/", (req, res) => {
  res.status(400).sendFile(path.join(__dirname + "/src/pages/index.html"));
});

app.get("/*", (req, res) => {
  res.status(400).sendFile(path.join(__dirname + "/src/pages/404.html"));
});
