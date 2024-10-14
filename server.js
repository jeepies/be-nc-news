const app = require('./app');
require('dotenv').config();

const server = app.listen()

module.exports = server;