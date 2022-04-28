
const express = require('express')
const mongoose = require("mongoose");

const app = express()
const port = 4000

const userRouter = require("./routes/user.routes");
const bodyParser = require("body-parser");  

const MongoDB_URI='mongodb://localhost:27017/Users';
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: "100mb",
      extended: true,
      parameterLimit: 500000,
    })
  );
app.use(bodyParser.json());
app.use(userRouter);

mongoose
  .connect(MongoDB_URI)
  .then((result) => {
    app.listen(port, () => {
        console.log(`app listening at http://localhost:${port}`)
    })

  })
  .catch((error) => {
    console.log("error", error);
  });

