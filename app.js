const express = require("express");

const controllers = require("./server/controllers");

const app = express();

app.get("/api", controllers.api.index);
app.get("/api/topics", controllers.topics.getAll);
app.get("/api/articles/:id", controllers.articles.getByID);

app.use((err, request, response, next) => {
  const PSQL_ERR_CODES = ["42P02", "22P02"];
  if (PSQL_ERR_CODES.includes(err.code))
    return response.status(400).send({ message: "Bad Request" });
  next();
});

app.use((err, request, response, next) =>
  response.status(500).send({ message: "Internal Server Error" })
);

module.exports = app;