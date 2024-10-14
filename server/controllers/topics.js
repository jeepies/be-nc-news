const model = require("../models").topics;

exports.getAll = (request, response, next) => {
  model.fetchAll().then((data) => {
    response.status(200).json({ topics: data });
  }).catch((err) => next(err));
};
