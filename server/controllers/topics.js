const model = require("../models").topics;

exports.getAll = (request, response) => {
  model.fetchAll().then((data) => {
    response.status(200).json({ topics: data });
  });
};
