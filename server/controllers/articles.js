const res = require("express/lib/response");

const model = require("../models").articles;

exports.getByID = (request, response, next) => {
  const { id } = request.params;
  model
    .fetchByID(id)
    .then((data) => {
      if (data.rows.length === 0)
        response.status(404).json({ message: "ID does not exist" });
      else response.status(200).json(data.rows[0]);
    })
    .catch((err) => next(err));
};

exports.getAll = (request, response, next) => {
  model
    .fetchAll()
    .then((data) => {
      response.status(200).json({ articles: data });
    })
    .catch((err) => next(err));
};

exports.getCommentsByID = (request, response, next) => {
  const { id } = request.params;
  model
    .fetchCommentsByID(id)
    .then((data) => {
      if (data.length === 0)
        response
          .status(404)
          .json({ message: "This article has no comments, or does not exist" });
      else response.status(200).json({ comments: data });
    })
    .catch((err) => next(err));
};
