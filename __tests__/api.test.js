const request = require("supertest");
const app = require("../app");
const server = require("../server");

const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

const ENDPOINTS = require("../endpoints.json");

require("jest-sorted");

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
        expect(body.author).toBe("butter_bridge");
        expect(body.title).toBe("Living in the shadow of a great man");
        expect(body.article_id).toBe(1);
        expect(body.body).toBe("I find this existence challenging");
        expect(body.topic).toBe("mitch");
        expect(body.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(body.votes).toBe(100);
        expect(body.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  it("should return appropriately when given a valid ID that does not exist", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toEqual("ID does not exist");
      });
  });
  it("should return invalid request when passed in erroneous data", () => {
    return request(app)
      .get("/api/articles/id")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("Bad Request");
      });
  });
});

describe("GET /api/articles", () => {
  it("should respond with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy('created_at', { descending: true })
        articles.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.title).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
          expect(typeof article.body).toBe("undefined");
        });
      });
  });
});
