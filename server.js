var cors = require("cors");
var express = require("express"),
  app = express(),
  port = process.env.PORT || 3001,
  mongoose = require("mongoose"),
  Task = require("./api/models/apiModel"),
  bodyParser = require("body-parser");

var db = mongoose.connection;

db.on("connecting", function() {
  console.log("connecting to MongoDB...");
});

db.on("error", function(error) {
  console.error("Error in MongoDb connection: " + error);
  mongoose.disconnect();
});
db.on("connected", function() {
  console.log("MongoDB connected!");
});
db.once("open", function() {
  console.log("MongoDB connection opened!");
});
db.on("reconnected", function() {
  console.log("MongoDB reconnected!");
});
db.on("disconnected", function() {
  console.log("MongoDB disconnected!");
  mongoose.connect(
    "mongodb://localhost/_lighthousedb",
    { server: { auto_reconnect: true } }
  );
});

mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb://localhost/_lighthousedb",
  { server: { auto_reconnect: true } }
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var routes = require("./api/routes/apiRoutes");
routes(app);

app.listen(port);

console.log("_lighthouse-server API started on port: " + port);
