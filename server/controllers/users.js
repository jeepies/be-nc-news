const model = require("../models").users;

exports.getAll = (request, response, next) => {
  model
    .fetchAll()
    .then((data) => response.status(200).json({ users: data }))
    .catch((err) => next(err));
};
