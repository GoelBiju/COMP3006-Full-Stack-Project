let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../server");

const mongoose = require("mongoose");

chai.use(chaiHttp);

// TODO: Switch to using mongo-memory-server
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

  test.skip("Test GET /game/:gameId");

  // // TODO: This is causing issues with TravisCI
  // //       by exceeding the timeout limit (possibly to do with done()/promises).
  // // This may still not be closed correctly.
  suiteTeardown(async () => {
    // Rather than calling server.stop,
    // disconnecting here works.
    // return mongoose.disconnect(done);
    // mongoose.disconnect(() => {
    //   mongoose.connection.close(done);
    //   server.app.close();
    // });

    await mongoose.disconnect();
  });
});
