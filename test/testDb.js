const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

const connectTestDb = async () => {
  // Create Mongo memory server
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();

  // connect to test database
  await mongoose.connect(mongoUri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
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
