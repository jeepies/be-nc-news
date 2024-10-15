const model = require("../models").topics;
const { validator } = require("../../utils/validator");

exports.getAll = (request, response, next) => {
  model
    .fetchAll()
    .then((data) => {
      response.status(200).json({ topics: data });
    })
    .catch((err) => next(err));
};

exports.create = (request, response, next) => {
  const schema = {
    slug: "string",
    description: "string",
  };
  const payload = request.body;
  const result = validator(payload, schema);

  if (!result.success)
    return response
      .status(400)
      .json({ message: "Invalid body", errors: result.errors });

  model
    .create(payload)
    .then((data) => response.status(200).json(data))
    .catch((err) => next(err));
};
