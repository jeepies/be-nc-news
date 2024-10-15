const db = require("../../db/connection");
const format = require("pg-format");
const { sort } = require("../../db/data/test-data/articles");

exports.fetchByID = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then((data) => data);
};

exports.fetchAll = (topic, sort_by, order) => {
  let query = `SELECT 
        articles.article_id, articles.title, articles.author, 
        articles.topic, articles.created_at, articles.votes,
        articles.article_img_url, COUNT(comments)::Int AS comment_count
      FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`;

  if (topic) query += format(` WHERE topic = '%s'`, topic);

  query += format(
    ` GROUP BY articles.article_id
      ORDER BY articles.%s %s`,
    sort_by,
    order
  );

  return db.query(query).then((data) => data.rows);
};

exports.fetchCommentsByID = (id) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [id])
    .then((data) => data.rows);
};

exports.addCommentByID = (id, payload) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
      [id, payload.username, payload.body]
    )
    .then((data) => data.rows[0]);
};

exports.update = (id, payload) => {
  const query = format(
    `UPDATE articles SET votes = votes + %L WHERE article_id = %L RETURNING *`,
    payload.inc_votes,
    id
  );
  return db.query(query).then((data) => data.rows[0]);
};
