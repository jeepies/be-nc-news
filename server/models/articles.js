const db = require("../../db/connection");

exports.fetchByID = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then((data) => data);
};
