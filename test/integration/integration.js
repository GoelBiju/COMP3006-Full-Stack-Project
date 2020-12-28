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

  suiteTeardown((done) => {
    // Rather than calling server.stop,
    // disconnecting here works.
    return mongoose.disconnect(() => done());
  });
});
