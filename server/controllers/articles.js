const model = require("../models").articles;
const { validator } = require("../../utils/validator");

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

exports.getCommentsByID = async (request, response, next) => {
  const { id } = request.params;
  let article;
  try {
    article = await model.fetchByID(id);
  } catch(err) {
    return next(err)
  }

  if (article.rowCount === 0)
    return response.status(404).json({ message: "Article not found" });

  const comments = await model.fetchCommentsByID(id);
  response.status(200).json({ comments: comments });
};

exports.addComment = (request, response, next) => {
  const schema = {
    username: "string",
    body: "string",
  };

  const payload = request.body;
  const result = validator(payload, schema);

  if (!result.success)
    return response
      .status(400)
      .json({ message: "Invalid body", data: result.errors });

  const { id } = request.params;

  model
    .addCommentByID(id, payload)
    .then((data) => {
      response.status(200).json(data);
    })
    .then((err) => next(err));
};

exports.updateArticle = (request, response, next) => {
  const schema = {
    inc_votes: "number",
  };
  const payload = request.body;
  const result = validator(payload, schema);

  if (!result.success)
    return response
      .status(400)
      .json({ message: "Invalid body", data: result.errors });

  const { id } = request.params;

  model
    .update(id, payload)
    .then((data) => {
      if (!data)
        return response.status(404).json({ message: "Article not found" });
      response.status(200).json(data);
    })
    .catch((err) => next(err));
};
