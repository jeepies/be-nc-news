const model = require("../models").api;

exports.index = (request, response, next) => {
  model
    .fetchEndpoints()
    .then((data) => {
      response.status(200).json({ endpoints: data });
    })
    .catch((err) => next(err));
};
