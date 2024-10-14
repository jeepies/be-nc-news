const model = require("../models").comments;

exports.delete = (request, response, next) => {
  const { id } = request.params;

  model.deleteByID(id).then((affected) => {
    if (affected === 0)
      response.status(404).json({ message: "Comment not found" });
    else response.status(204).send();
  }).catch((err) => next(err));
};
