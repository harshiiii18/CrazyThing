// Set test env vars BEFORE anything else loads, since JWT signing reads
// these at call time. Tests never depend on the local .env file — this
// keeps them self-contained and runnable in CI without secrets.
process.env.JWT_SECRET = "test_secret_for_jest_do_not_use_in_prod";
process.env.JWT_EXPIRES_IN = "1h";
process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});