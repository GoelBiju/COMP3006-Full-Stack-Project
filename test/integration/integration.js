let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../server");

const mongoose = require("mongoose");
const { app } = require("../../server");

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

  // TODO: This is causing issues with TravisCI
  //       by exceeding the timeout limit (possibly to do with done()/promises).
  suiteTeardown(() => {
    // Rather than calling server.stop,
    // disconnecting here works.
    // return mongoose.disconnect(done);
    mongoose.connection.close();
    app.close();
  });
});
