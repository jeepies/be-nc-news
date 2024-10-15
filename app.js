const express = require("express");

const controllers = require("./server/controllers");

const app = express();

app.use(express.json());

app.get("/api", controllers.api.index);
app.get("/api/topics", controllers.topics.getAll);
app.get("/api/articles/:id", controllers.articles.getByID);
app.get("/api/articles", controllers.articles.getAll);
app.get("/api/articles/:id/comments", controllers.articles.getCommentsByID);
app.post("/api/articles/:id/comments", controllers.articles.addComment);
app.patch("/api/articles/:id", controllers.articles.updateArticle);
app.delete("/api/comments/:id", controllers.comments.delete);
app.get("/api/users", controllers.users.getAll);
app.post("/api/topics", controllers.topics.create);

app.use((err, request, response, next) => {
  const PSQL_ERR_CODES = ["42P02", "22P02"];
  if (PSQL_ERR_CODES.includes(err.code))
    return response.status(400).send({ message: "Bad Request" });
  next();
});

app.use((err, request, response, next) => {
  if(err.status && err.message) return response.status(err.status).json({ message: err.message })
    next();
})

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send({ message: "Internal Server Error" });
});

module.exports = app;
