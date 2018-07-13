"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Schemat uzytkownika
var postsSchema = new Schema(
  {
    title: {
      type: String,
      required: "Enter a title for this post"
    },
    content: {
      type: String,
      required: "The post can't be empty"
    },
    url: {
      type: String,
      required: "Enter a url for this post"
    },
    media: String,

    author: {
      surname: String,
      lastname: String,
      username: {
        type: String,
        required: "Enter authors username"
      }
    }
  },
  { strict: false }
);

module.exports = mongoose.model("Posts", postsSchema);
