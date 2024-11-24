const express = require('express');
const app = express();
const bodyParser = require("body-parser");
require('dotenv').config();

app.use(bodyParser.json());

require("./route/booking")(app)

app.listen(process.env.PORT, () => {
  console.log("server started successfully");
});