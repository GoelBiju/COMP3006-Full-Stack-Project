let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");

chai.use(chaiHttp);

suite("Integration Tests for landing page", function () {
  test("Test GET /", function () {
    let app = server.app;

    chai
      .request(app)
      .get("/")
      .end(function (error, response) {
        chai.assert.equal(response.status, 200, "Wrong status code");
        // chai.assert.equal(response.text, "Connect Four", "Wrong response text");
      });
  });
});