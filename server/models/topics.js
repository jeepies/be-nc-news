const db = require("../../db/connection");

exports.fetchAll = () => {
  return db.query("SELECT * FROM topics").then((data) => data.rows);
};

exports.fetchBySlug = (slug) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [slug])
    .then((data) => data.rows[0]);
};
