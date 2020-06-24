const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");

const monday = require("./src/monday");
const app = express();

const allowedOrigins = [
  "https://jetpack-master.netlify.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/", monday);

app.listen(process.env.PORT || 4000, () => {
  console.log("Server is running on 4000 port");
});
