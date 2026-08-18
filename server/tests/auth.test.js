require("./setup");
const request = require("supertest");
const app = require("../app");
const { createUserAndLogin } = require("./helpers");

describe("Auth", () => {
  test("signup creates a user and returns a token", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Aarav Mehta",
      username: "aarav_test",
      email: "aarav_test@example.com",
      password: "SecurePass123",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe("aarav_test@example.com");
    // Password must never be returned, even on signup
    expect(res.body.data.user.password).toBeUndefined();
  });

  test("signup rejects a duplicate email", async () => {
    await request(app).post("/api/auth/signup").send({
      name: "First User",
      username: "first_user",
      email: "dupe@example.com",
      password: "SecurePass123",
    });

    const res = await request(app).post("/api/auth/signup").send({
      name: "Second User",
      username: "second_user",
      email: "dupe@example.com",
      password: "SecurePass123",
    });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  test("signup rejects a short password", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Short Pass",
      username: "shortpass",
      email: "shortpass@example.com",
      password: "123",
    });

    expect(res.status).toBe(400);
  });

  test("login succeeds with correct credentials", async () => {
    const { payload } = await createUserAndLogin();

    const res = await request(app).post("/api/auth/login").send({
      email: payload.email,
      password: payload.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  test("login fails with wrong password", async () => {
    const { payload } = await createUserAndLogin();

    const res = await request(app).post("/api/auth/login").send({
      email: payload.email,
      password: "WrongPassword123",
    });

    expect(res.status).toBe(401);
  });

  test("protected route rejects requests with no token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  test("protected route succeeds with a valid token", async () => {
    const { token } = await createUserAndLogin();

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBeDefined();
  });
});