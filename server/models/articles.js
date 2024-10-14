const db = require("../../db/connection");

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
