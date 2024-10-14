const db = require("../../db/connection");

exports.fetchAll = () =>
  db.query("SELECT * FROM users").then((data) => data.rows);
