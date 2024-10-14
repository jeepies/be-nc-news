const express = require("express");
require("dotenv").config();

const controllers = require("./server/controllers");

const app = express();

app.get("/api", controllers.api.index);
app.get("/api/topics", controllers.topics.getAll);

app.use((err, request, response, next) =>
  response.status(500).send({ msg: "Internal Server Error" })
);

const server = app.listen();

module.exports = { app, server };
