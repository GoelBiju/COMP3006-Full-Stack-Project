let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../server");

const mongoose = require("mongoose");
const { deleteOne } = require("../../src/models/Game");

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

  // TODO: This is causing issues with TravisCI
  //       by exceeding the timeout limit (possibly to do with done()/promises).
  // This may still not be closed correctly.
  suiteTeardown((done) => {
    // Rather than calling server.stop,
    // disconnecting here works.
    // return mongoose.disconnect(done);
    mongoose.connection.close().then(() => done());
    server.app.close();
  });
});
