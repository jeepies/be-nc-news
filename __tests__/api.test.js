const request = require("supertest");
const { app, server } = require("../index");

const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(async () => await seed(data));

afterAll(() => {
  server.close();
  connection.end();
});

describe("GET: /api/topics", () => {
  it("should respond with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.topics)).toBe(true);
        body.topics.forEach((topic) => {
          expect(topic.slug).not.toBe(undefined);
          expect(topic.description).not.toBe(undefined);
        });
      });
  });
});
