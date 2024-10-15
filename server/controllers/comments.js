const model = require("../models").comments;
const { validator } = require("../../utils/validator");

exports.delete = (request, response, next) => {
  const { id } = request.params;

  model
    .deleteByID(id)
    .then((affected) => {
      if (affected === 0)
        response.status(404).json({ message: "Comment not found" });
      else response.status(204).send();
    })
    .catch((err) => next(err));
};

exports.update = async (request, response, next) => {
  const schema = {
    inc_votes: "number",
  };

  const payload = request.body;
  const result = validator(payload, schema);

  if (!result.success)
    return response
      .status(400)
      .json({ message: "Invalid body", errors: result.errors });

  const { id } = request.params;

  try {
    const comment = await model.getByID(id);
    if (!comment)
      return response.status(404).json({ message: "Comment does not exist" });

    const data = await model.update(id, payload);
    return response.status(200).json(data);
  } catch (e) {
    next(e);
  }
};
