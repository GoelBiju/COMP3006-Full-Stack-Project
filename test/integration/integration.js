let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../server");

const mongoose = require("mongoose");

chai.use(chaiHttp);

suite("Integration Tests", function () {
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

  test.skip("Test GET /login");

  test.skip("Test GET /register");

  test.skip("Test POST /api/login");

  test.skip("Test POST /api/register");

  test.skip("Test GET /api/logout");

  test.skip("Test GET /game/:gameId");

  suiteTeardown(async () => {
    await mongoose.disconnect();
  });
});
