const model = require("../models").articles;
const topics = require("../models").topics;
const users = require("../models").users;
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

exports.getAll = async (request, response, next) => {
  const validSortBy = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
  ];
  const validOrder = ["desc", "asc"];

  let { sort_by, order, topic, limit, p } = request.query;

  sort_by = validSortBy.includes(sort_by) ? sort_by : "created_at";
  order = validOrder.includes(order) ? order : "desc";
  limit = limit ?? 10;
  p = (p ?? 0) * limit;

  try {
    let articles;
    if (topic) {
      const topicData = await topics.fetchBySlug(topic);
      if (topicData)
        articles = await model.fetchAll(sort_by, order, limit, p, topicData.slug);
      else response.status(400).json({ message: "Topic does not exist" });
    } else articles = await model.fetchAll(sort_by, order, limit, p);

    return response.status(200).json({ articles: articles });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsByID = async (request, response, next) => {
  const { id } = request.params;
  let article;
  try {
    article = await model.fetchByID(id);
  } catch (err) {
    return next(err);
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

exports.create = async (request, response, next) => {
  const schema = {
    author: "string",
    title: "string",
    body: "string",
    topic: "string",
    article_img_url: "string,optional",
  };

  const payload = request.body;
  const result = validator(payload, schema);

  if (!result.success)
    return response
      .status(400)
      .json({ message: "Invalid body", errors: result.errors });

  try {
    const user = await users.fetchByUsername(payload.author);
    if (!user) return response.status(404).json({ message: "User not found" });

    const topic = await topics.fetchBySlug(payload.topic);
    if (!topic)
      return response.status(404).json({ message: "Topic not found" });

    const article = await model.create(payload);
    article.comment_count = 0;
    response.status(200).json(article);
  } catch (e) {
    next(e);
  }
};
