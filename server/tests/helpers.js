const request = require("supertest");
const app = require("../app");

// Creates a user via the real signup endpoint and returns their auth token,
// so tests exercise the actual signup flow rather than inserting rows directly.
async function createUserAndLogin(overrides = {}) {
  const payload = {
    name: "Test User",
    username: `testuser_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    email: `test_${Date.now()}_${Math.random().toString(36).slice(2, 6)}@example.com`,
    password: "TestPass123",
    ...overrides,
  };

  const res = await request(app).post("/api/auth/signup").send(payload);
  return { token: res.body.data.token, user: res.body.data.user, payload };
}

module.exports = { createUserAndLogin };