const db = require("../../db/connection");

exports.getByID = (id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [id])
    .then((data) => data.rows[0]);
};

exports.deleteByID = (id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1", [id])
    .then((data) => data.rowCount);
};

exports.update = (id, payload) => {
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`,
      [payload.inc_votes, id]
    )
    .then((data) => data.rows[0]);
};
