const db = require("../../db/connection");

exports.fetchAll = () =>
  db.query("SELECT * FROM users").then((data) => data.rows);

exports.fetchByUsername = (username) =>
  db
    .query(`SELECT username, avatar_url, name FROM users WHERE username = $1`, [
      username,
    ])
    .then((data) => data.rows[0]);
