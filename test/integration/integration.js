let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../server");

const mongoose = require("mongoose");
const Game = require("../../src/models/Game");

chai.use(chaiHttp);

suite("Integration Tests", function (done) {
  suiteSetup(() => {
    // Minimise debugging information in tests
    mongoose.set("debug", false);
  });

  test("Test GET /", function (done) {
    let app = server.app;

    chai
      .request(app)
      .get("/")
      .end(function (error, response) {
        chai.assert.equal(response.status, 200, "Wrong status code");
        done();
      });
  });

  test("Test GET /login", function (done) {
    let app = server.app;

    chai
      .request(app)
      .get("/login")
      .end(function (error, response) {
        chai.assert.equal(response.status, 200, "Wrong status code");
        done();
      });
  });

  test("Test GET /register", function (done) {
    let app = server.app;

    chai
      .request(app)
      .get("/register")
      .end(function (error, response) {
        chai.assert.equal(response.status, 200, "Wrong status code");
        done();
      });
  });

  test("Test POST /api/register", function (done) {
    let app = server.app;

    chai
      .request(app)
      .post("/api/register")
      .send({ username: "integration", password: "integration" })
      .end(function (error, response) {
        chai.assert.equal(response.status, 200, "Wrong status code");
        done();
      });
  });

  test("Test POST /api/login", function (done) {
    let app = server.app;

    chai
      .request(app)
      .post("/api/login")
      .send({ username: "integration", password: "integration" })
      .end(function (error, response) {
        chai.assert.equal(response.status, 200, "Wrong status code");
        done();
      });
  });

  test("Test GET /api/logout", function (done) {
    let app = server.app;

    chai
      .request(app)
      .get("/api/logout")
      .end(function (error, response) {
        chai.assert.equal(response.status, 200, "Wrong status code");
        done();
      });
  });

  test("Test GET /game/:gameId", function (done) {
    let app = server.app;

    chai
      .request(app)
      .post("/api/login")
      .send({ username: "test", password: "test" })
      .end(function (error, response) {
        chai.assert.equal(response.status, 200, "Wrong status code");
        done();
      });

    let game = new Game();
    game.save((err, game) => {
      chai
        .request(server.app)
        .get("/game/" + game._id)
        .end(function (error, response) {
          chai.assert.equal(response.status, 200, "Wrong status code");
          console.log("response: ", response.body);
          done();
        });
    });
  });

  suiteTeardown(async () => {
    await mongoose.disconnect();
  });
});
