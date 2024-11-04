const express = require("express");
const cors = require("cors");

const routers = require("./routers");
const controllers = require("./server/controllers");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", controllers.api.index);
Object.entries(routers).forEach((router) => {
  console.log(`[+] Registering /api/${router[0]}`);
  app.use(`/api/${router[0]}`, router[1]);
});

app.use((err, request, response, next) => {
  const PSQL_ERR_CODES = ["42P02", "22P02"];
  if (PSQL_ERR_CODES.includes(err.code))
    return response.status(400).send({ message: "Bad Request" });
  next();
});

app.use((err, request, response, next) => {
  if (err.status && err.message)
    return response.status(err.status).json({ message: err.message });
  next();
});

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send({ message: "Internal Server Error" });
});

module.exports = app;
