const request = require("supertest");
const app = require("../app");
const server = require("../server")

const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

const ENDPOINTS = require("../endpoints.json");

beforeEach(async () => await seed(data));

afterAll(() => {
  server.close();
  connection.end();
});

describe("GET /api", () => {
  it("should respond with an array of endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(ENDPOINTS);
      });
  });
});

describe("GET: /api/topics", () => {
  it("should respond with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.topics)).toBe(true);
        expect(body.topics.length).toEqual(3);
        body.topics.forEach((topic) => {
          expect(topic.slug).not.toBe(undefined);
          expect(topic.description).not.toBe(undefined);
        });
      });
  });
});

describe("GET /api/articles/:id", () => {
  it("should respond with an article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.author).not.toBe(undefined);
        expect(body.title).not.toBe(undefined);
        expect(body.article_id).not.toBe(undefined);
        expect(body.body).not.toBe(undefined);
        expect(body.topic).not.toBe(undefined);
        expect(body.created_at).not.toBe(undefined);
        expect(body.votes).not.toBe(undefined);
        expect(body.article_img_url).not.toBe(undefined);
      });
  });
  it("should return appropriately when given a valid ID that does not exist", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toEqual("ID does not exist")
      });
  });
  it("should return invalid request when passed in erroneous data", () => {
    return request(app)
      .get("/api/articles/id")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("Bad Request")
      });
  });
});
