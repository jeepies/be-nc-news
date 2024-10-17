const db = require("../../db/connection");
const format = require("pg-format");

exports.fetchByID = (id) => {
  return db
    .query(
      `SELECT 
        articles.article_id, articles.title, articles.author, 
        articles.topic, articles.created_at, articles.votes,
        articles.body, articles.article_img_url, COUNT(comments)::Int AS comment_count
      FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
      [id]
    )
    .then((data) => data);
};

exports.fetchAll = (sort_by, order, limit, p, topic) => {
  let query = `SELECT 
        articles.article_id, articles.title, articles.author, 
        articles.topic, articles.created_at, articles.votes,
        articles.article_img_url, COUNT(comments)::Int AS comment_count
      FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`;

  if (topic) query += ` WHERE topic = '${topic}'`;

  query += ` GROUP BY articles.article_id ORDER BY articles.${sort_by} ${order} LIMIT ${limit} OFFSET ${p}`;

  return db.query(query).then((data) => data.rows);
};

exports.fetchCommentsByID = (id, p, limit) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1 LIMIT $2 OFFSET $3`, [
      id,
      limit,
      p,
    ])
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

exports.create = (payload) => {
  const params = [payload.title, payload.topic, payload.author, payload.body];
  if (payload.article_img_url) params.push(payload.article_img_url);

  return db
    .query(
      `INSERT INTO articles (title, topic, author, body${
        payload.article_img_url ? ", article_img_url" : ""
      }) VALUES ($1, $2, $3, $4${
        payload.article_img_url ? ", $5" : ""
      }) RETURNING *`,
      params
    )
    .then((data) => data.rows[0]);
};

exports.delete = (id) =>
  db
    .query(`DELETE FROM articles WHERE article_id = $1`, [id])
    .then((data) => data);
