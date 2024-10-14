const model = require("../models").articles;

exports.getByID = (request, response, next) => {
  const { id } = request.params;
  model
    .fetchByID(id)
    .then((data) => {
      console.log(data)
      if (data.rows.length === 0)
        return response.status(404).json({ message: "ID does not exist" });
      else response.status(200).json(data.rows[0])
    })
    .catch((err) => next(err));
};
