const express = require("express");
const route = require('./route');
const mongoose = require("mongoose");
const app = express();
 app.use(express.json());

mongoose.set('strictQuery', true);
 mongoose
  .connect(
    "mongodb+srv://aashu:root@mini-project-cluster.kzrvbeg.mongodb.net/Student-Marks-Company-P4?retryWrites=true&w=majority",
    { UseNewUrlParser: true }
  )
  .then(() => console.log("Mongodb is connected"))
  .catch((err) => console.log(err.message))

app.use("/", route);

app.listen(3000, function () {
  console.log("listening at " + 3000)})