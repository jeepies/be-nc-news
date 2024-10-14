const db = require('../../db/connection');

exports.fetchAll = () => {
    return db.query('SELECT * FROM topics').then((data) => data.rows);
}