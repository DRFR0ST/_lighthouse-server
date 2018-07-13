"use strict";
module.exports = function(app) {
  var apiUrl = require("../controllers/apiController");

  app.route("/").post(apiUrl.requestHandler);
};
