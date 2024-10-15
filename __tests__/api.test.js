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
  it("200: should respond with an array of endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(ENDPOINTS);
      });
  });
});

describe("GET: /api/topics", () => {
  it("200: should respond with an array of topic objects", () => {
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
  it("200: should respond with an article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(
        ({
          body: {
            author,
            title,
            article_id,
            body,
            topic,
            created_at,
            votes,
            article_img_url,
            comment_count,
          },
        }) => {
          expect(author).toBe("butter_bridge");
          expect(title).toBe("Living in the shadow of a great man");
          expect(article_id).toBe(1);
          expect(body).toBe("I find this existence challenging");
          expect(topic).toBe("mitch");
          expect(created_at).toBe("2020-07-09T20:11:00.000Z");
          expect(votes).toBe(100);
          expect(article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
          expect(comment_count).toBe(11);
        }
      );
  });
  it("404: should return appropriately when given a valid ID that does not exist", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toEqual("ID does not exist");
      });
  });
  it("400: should return invalid request when passed in erroneous data", () => {
    return request(app)
      .get("/api/articles/id")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("Bad Request");
      });
  });
});

describe("GET /api/articles", () => {
  const desiredObject = {
    article_id: expect.toBeNumber(),
    title: expect.toBeString(),
    author: expect.toBeString(),
    topic: expect.toBeString(),
    created_at: expect.toBeString(),
    votes: expect.toBeNumber(),
    article_img_url: expect.toBeString(),
    comment_count: expect.toBeNumber(),
  };

  it("200: should respond with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) =>
          expect(article).toMatchObject(desiredObject)
        );
      });
  });
  it("200: should respond with an array of article objects when passed a sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("title", { descending: true });
        articles.forEach((article) =>
          expect(article).toMatchObject(desiredObject)
        );
      });
  });
  it("200: should respond with an array of article objects when passed sort_by and order queries", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("votes", { descending: false });
        articles.forEach((article) =>
          expect(article).toMatchObject(desiredObject)
        );
      });
  });
  it("200: should respond with an array of article objects when passed an erroneous sort_by and order queries", () => {
    return request(app)
      .get("/api/articles?sort_by=test&order=test")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) =>
          expect(article).toMatchObject(desiredObject)
        );
      });
  });
  it("200: should respond with an array of article objects when passed a topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(12);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toMatchObject(desiredObject);
          expect(article.topic).toBe("mitch");
        });
      });
  });
  it("200: should respond with an array of article objects when passed multiple queries", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(12);
        expect(articles).toBeSortedBy("title", { descending: false });
        articles.forEach((article) => {
          expect(article).toMatchObject(desiredObject);
          expect(article.topic).toBe("mitch");
        });
      });
  });
  it("200: should respond with an empty array when passed a topic with no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
  it("400: should respond with an error when passed an invalid topic", () => {
    return request(app)
      .get("/api/articles?topic=northcoders")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Topic does not exist");
      });
  });
});

describe("GET /api/articles/:id/comments", () => {
  it("200: should return all comments from article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments.length).toBe(11);
        body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(comment.article_id).toBe(1);
        });
      });
  });
  it("200: should return appropriately when given an article with no comments", () => {
    return request(app)
      .get("/api/articles/8/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  it("404: should return appropriately when given a non-existent article", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article not found");
      });
  });
  it("400: should return appropriately hen given an invalid query parameter", () => {
    return request(app)
      .get("/api/articles/id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request");
      });
  });
});

describe("POST /api/articles/:id/comments", () => {
  it("200: should add a new comment, and return it", () => {
    const comment = {
      username: "icellusedkars",
      body: "i'm a commenter :3",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(200)
      .then(
        ({
          body: { comment_id, body, article_id, author, votes, created_at },
        }) => {
          expect(author).toBe(comment.username);
          expect(body).toBe(comment.body);
          expect(article_id).toBe(1);
          expect(typeof comment_id).toBe("number");
          expect(votes).toBe(0);
          expect(typeof created_at).toBe("string");
        }
      );
  });
  it("400: should return appropriately when given an invalid comment", () => {
    const comment = {
      username: 1,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(400)
      .then(({ body: { data } }) => {
        expect(data).toEqual([
          "username is invalid type - expected string, got number",
          "body does not exist on payload",
        ]);
      });
  });
});

describe("PATCH: /api/articles/:id", () => {
  it("200: should update an article and return the updated article", () => {
    const update = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(200)
      .then(({ body: { votes } }) => {
        expect(votes).toBe(101);
      });
  });
  it("200: should update an article and return the updated article", () => {
    const update = { inc_votes: -205 };
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(200)
      .then(({ body: { votes } }) => {
        expect(votes).toBe(-105);
      });
  });
  it("400: should return appropriately when passed in invalid data", () => {
    const update = {};
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(400)
      .then(({ body: { message, data } }) => {
        expect(message).toBe("Invalid body");
        expect(data).toEqual(["inc_votes does not exist on payload"]);
      });
  });
  it("400: should return appropriately when passed in an invalid article", () => {
    const update = { inc_votes: 12 };
    return request(app)
      .patch("/api/articles/id")
      .send(update)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request");
      });
  });
  it("404: should return appropriately when passed in an invalid article", () => {
    const update = { inc_votes: 12 };
    return request(app)
      .patch("/api/articles/999")
      .send(update)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Article not found");
      });
  });
});

describe("DELETE /api/comments/:id", () => {
  it("204: should delete a comment", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  it("404: should return appropriately when deleting a non-existent comment", () => {
    return request(app)
      .delete("/api/comments/999999")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Comment not found");
      });
  });
  it("400: should return appropriately when passed a non-numeric id", () => {
    return request(app)
      .delete("/api/comments/comment")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request");
      });
  });
});

describe("GET /api/users", () => {
  it("200: should return an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("POST /api/topics", () => {
  it("200: should create a new topic and return the topic object", () => {
    const payload = {
      slug: "programming",
      description: "silly little computers beep boop",
    };
    return request(app)
      .post("/api/topics")
      .send(payload)
      .expect(200)
      .then(({ body: { slug, description } }) => {
        expect(slug).toBe(payload.slug);
        expect(description).toBe(payload.description);
      });
  });
  it("400: should return appropriate error when passed in incorrect data", () => {
    const payload = {
      slug: 1,
    };
    return request(app)
      .post("/api/topics")
      .send(payload)
      .expect(400)
      .then(({ body: { message, errors } }) => {
        expect(message).toBe("Invalid body");
        expect(errors).toEqual([
          "slug is invalid type - expected string, got number",
          "description does not exist on payload",
        ]);
      });
  });
});

describe("GET /api/users/:username", () => {
  it("200: should return a user object", () => {
    return request(app)
      .get("/api/users/icellusedkars")
      .expect(200)
      .then(({ body }) => {
        const desiredObject = {
          username: expect.toBeString(),
          avatar_url: expect.toBeString(),
          name: expect.toBeString(),
        };
        expect(body).toMatchObject(desiredObject);
      });
  });
  it("404: should return when passed a non-existent username", () => {
    return request(app)
      .get("/api/users/jay")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("User not found");
      });
  });
});
