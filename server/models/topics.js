const db = require("../../db/connection");

exports.fetchAll = () => {
  return db.query("SELECT * FROM topics").then((data) => data.rows);
};

exports.fetchBySlug = (slug) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [slug])
    .then((data) => data.rows[0]);
};

exports.create = (payload) =>
  db
    .query(
      `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *`,
      [payload.slug, payload.description]
    )
    .then((data) => data.rows[0]);
