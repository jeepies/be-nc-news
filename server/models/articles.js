const db = require("../../db/connection");
const format = require("pg-format");

exports.fetchByID = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then((data) => data);
};

exports.fetchAll = () => {
  return db
    .query(
      `
      SELECT 
        articles.article_id, articles.title, articles.author, 
        articles.topic, articles.created_at, articles.votes,
        articles.article_img_url, COUNT(comments)::Int AS comment_count
      FROM articles 
      
      LEFT JOIN comments ON comments.article_id = articles.article_id

      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC
      `
    )
    .then((data) => data.rows);
};

exports.fetchCommentsByID = (id) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [id])
    .then((data) => data.rows);
};

exports.addCommentByID = (id, payload) => {
  const query = format(
    `INSERT INTO comments (article_id, author, body) VALUES (%L, %L, %L) RETURNING *`,
    id,
    payload.username,
    payload.body
  );
  return db.query(query).then((data) => data.rows[0]);
};

exports.update = (id, payload) => {
  const query = format(
    `UPDATE articles SET votes = votes + %L WHERE article_id = %L RETURNING *`,
    payload.inc_votes,
    id
  );
  return db.query(query).then((data) => data.rows[0]);
};
