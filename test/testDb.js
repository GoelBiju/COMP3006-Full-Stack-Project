const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

const connectTestDb = async () => {
  // Create Mongo memory server
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();

  // Disconnect any active connections
  await mongoose.disconnect();

  // connect to test database
  await mongoose
    .connect(mongoUri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      // Disable any debugging information from showing.
      mongoose.set("debug", false);
    });
};

const disconnectTestDb = async () => {
  // Disconnect test database
  await mongoose.disconnect();
  await mongoServer.stop();
};

module.exports = {
  connectTestDb,
  disconnectTestDb,
};
