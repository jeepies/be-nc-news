const express = require("express");
require("dotenv").config();

const controllers = require('./server/controllers');

const app = express();

app.get("/api/topics", controllers.topics.getAll);

const server = app.listen();

module.exports = { app, server };
