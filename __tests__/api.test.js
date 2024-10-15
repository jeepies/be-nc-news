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
        }
      );
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
        expect(articles).toBeSortedBy("created_at", { descending: true });
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
  it("should respond with an array of article objects when passed a sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("title", { descending: true });
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
  it("should respond with an array of article objects when passed sort_by and order queries", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("votes", { descending: false });
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
  it("should respond with an array of article objects when passed an erroneous sort_by and order queries", () => {
    return request(app)
      .get("/api/articles?sort_by=test&order=test")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
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
  it("should respond with an array of article objects when passed a topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(12);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.title).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(article.topic).toBe("mitch");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
          expect(typeof article.body).toBe("undefined");
        });
      });
  });
  it("should respond with an array of article objects when passed a topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(1);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.title).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(article.topic).toBe("cats");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
          expect(typeof article.body).toBe("undefined");
        });
      });
  });
  it("should respond with an array of article objects when passed multiple queries", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(12);
        expect(articles).toBeSortedBy("title", { descending: false });
        articles.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.title).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(article.topic).toBe("mitch");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
          expect(typeof article.body).toBe("undefined");
        });
      });
  });
  it("should respond with an array of article objects when passed a topic that doesn't exist", () => {
    return request(app)
      .get("/api/articles?topic=northcoders")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Topic does not exist");
      });
  });
});

describe("GET /api/articles/:id/comments", () => {
  it("should return all comments from article", () => {
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
  it("should return appropriately when given a non-existent article", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe(
          "Article not found"
        );
      });
  });
  it("should return appropriately when given an article with no comments", () => {
    return request(app)
      .get("/api/articles/8/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  it("should return appropriately hen given an invalid query parameter", () => {
    return request(app)
      .get("/api/articles/id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request");
      });
  });
});

describe("POST /api/articles/:id/comments", () => {
  it("should add a new comment, and return it", () => {
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
  it("should return appropriately when given an invalid comment", () => {
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
  it("should update an article and return the updated article", () => {
    const update = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(200)
      .then(({ body: { votes } }) => {
        expect(votes).toBe(101);
      });
  });
  it("should update an article and return the updated article", () => {
    const update = { inc_votes: -205 };
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(200)
      .then(({ body: { votes } }) => {
        expect(votes).toBe(-105);
      });
  });
  it("should return appropriately when passed in invalid data", () => {
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
  it("should return appropriately when passed in an invalid article", () => {
    const update = { inc_votes: 12 };
    return request(app)
      .patch("/api/articles/999")
      .send(update)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Article not found");
      });
  });
  it("should return appropriately when passed in an invalid article", () => {
    const update = { inc_votes: 12 };
    return request(app)
      .patch("/api/articles/id")
      .send(update)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request");
      });
  });
});

describe("DELETE /api/comments/:id", () => {
  it("should delete a comment", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  it("should return appropriately when deleting a non-existent comment", () => {
    return request(app)
      .delete("/api/comments/999999")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Comment not found");
      });
  });
  it("should return appropriately when passed a non-numeric id", () => {
    return request(app)
      .delete("/api/comments/comment")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request");
      });
  });
});

describe("GET /api/users", () => {
  it("should return an array of user objects", () => {
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
