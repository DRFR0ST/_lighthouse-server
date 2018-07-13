"use strict";

var mongoose = require("mongoose"),
  Posts = mongoose.model("Posts");

let output = [],
  counter = 0;

exports.requestHandler = function(req, res) {
  let authorized = authorize(req.body.auth);

  if (!authorized.status) return response(res, "401", authorized.message, null);

  const executer = req.body.auth[1];
  delete req.body.auth;
  authorized = undefined;

  var exec = req.body.exec;

  counter = exec.length;

  for (var i = 0; i < exec.length; i++) {
    const exec_name = exec[i][0];
    log(exec_name + " executed by " + executer);

    switch (exec_name) {
      case "postList":
        postList(res, i);
        break;

      case "postCreate":
        postCreate(exec[i], res, i);
        break;

      case "postRemove":
        postRemove(exec[i], res, i);
        break;

      default:
        response(res, "405", "Command not found!", null, i);
        break;
    }
  }
};

function postCreate(data, res, id) {
  const postData = data[2];
  const authorData = data[2].author;

  Posts.findOne({ url: postData.url }, function(post, err) {
    if (err) {
      if (err.url !== undefined) {
        response(res, "403", "Post with that url already exists!", null, id);
        return;
      }
      res.send(err);
    }

    if (post != null) {
      response(res, "403", "Post with that url already exists!", null, id);
      return;
    }

    let newPostData = Object.assign({}, postData, { created: new Date() });

    const newPost = new Posts(newPostData);

    newPost.save(function(err) {
      if (err) res.send(err);

      response(res, "204", "", newPost, id);
    });
  });
}

function postRemove(data, res, id) {
  var key = data[2].id || data[2].url || null;

  if (key === null) {
    response(res, "400", "Key value missing.", null, id);
  }

  let find = key === data[2].id ? { id: key } : { url: key };

  Posts.findOne(find, function(err, post) {
    if (err) {
      res.send(err);
      return;
    }

    if (post == null) {
      response(res, "404", "Data not found!", null, id);
      return;
    }

    post.remove(function(err, post) {
      if (err) res.send(err);

      response(res, "204", "", null, id);
    });
  });
}

function postList(res, id) {
  Posts.find({}, { __v: false }, function(err, post) {
    if (err) {
      res.send(err);
      return;
    }

    response(res, "200", "", post, id);
  });
}

function response(res, status, message, data, id = null) {
  if (id === null) {
    res.json([{ status: status, message: message, data: data }]);
    return;
  }

  output[id] = { status: status, message: message, data: data };
  counter--;
  if (counter === 0) {
    res.json(output);
    output = [];
  }
}

function authorize(auth) {
  let output = new Object();

  switch (auth[0]) {
    case 100:
      if (auth[1] === "root" && auth[2] === "superpass") {
        return { status: true, message: "Authorization succeeded." };
      } else {
        return { status: false, message: "Authorization failed." };
      }
      break;

    default:
      return { status: false, message: "Unexpected behavior occured." };
  }

  return { status: false, message: "Unexpected behavior occured." };
}

function log(message, options = {}) {
  options = {
    type: options.type || "info"
  };

  switch (options.type) {
    case "info":
      console.log(new Date().now, message);
      break;

    case "error":
      console.error(new Date().now, message);
      break;
  }
}
