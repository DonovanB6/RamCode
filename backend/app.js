const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const questionRoutes = require("./routes/questions");

const app = express();

mongoose.connect('mongodb://localhost:27017/Mean-Demo')
.then(() =>  {
  console.log('Connected to MongoDB');
})
.catch(() => {
  console.log('Connection Failed');
});

app.use(bodyParser.json());

app.use((req,res,next) =>
{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type,Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,PUT,DELETE,OPTIONS");
  next();
})

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/question", questionRoutes);

module.exports = app;
