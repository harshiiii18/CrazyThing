require("./setup");
const request = require("supertest");
const app = require("../app");
const { createUserAndLogin } = require("./helpers");
const Category = require("../models/Category");

async function makeCategory() {
  return Category.create({ name: "Electronics", slug: "electronics" });
}

describe("Products", () => {
  test("creating a listing requires authentication", async () => {
    const category = await makeCategory();

    const res = await request(app).post("/api/products").send({
      title: "Test item",
      description: "A test item",
      price: 1000,
      category: category._id,
      condition: "GOOD",
      location: "Jaipur, RJ",
    });

    expect(res.status).toBe(401);
  });

  test("an authenticated user can create a listing", async () => {
    const { token } = await createUserAndLogin();
    const category = await makeCategory();

    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Apple iPhone 13 128GB",
        description: "Good condition, battery 88%",
        price: 32999,
        category: category._id,
        condition: "GOOD",
        location: "Jaipur, RJ",
      });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe("Apple iPhone 13 128GB");
    expect(res.body.data.status).toBe("ACTIVE");
  });

  test("listing creation rejects a missing required field", async () => {
    const { token } = await createUserAndLogin();
    const category = await makeCategory();

    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        // title missing on purpose
        description: "Missing a title",
        price: 500,
        category: category._id,
        condition: "GOOD",
        location: "Jaipur, RJ",
      });

    expect(res.status).toBe(400);
  });

  test("a seller cannot edit another seller's listing", async () => {
    const seller = await createUserAndLogin();
    const otherUser = await createUserAndLogin();
    const category = await makeCategory();

    const created = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${seller.token}`)
      .send({
        title: "Sony Headphones",
        description: "Barely used",
        price: 14500,
        category: category._id,
        condition: "LIKE_NEW",
        location: "Mumbai, MH",
      });

    const res = await request(app)
      .put(`/api/products/${created.body.data._id}`)
      .set("Authorization", `Bearer ${otherUser.token}`)
      .send({ price: 1 });

    expect(res.status).toBe(403);
  });

  test("product listing endpoint returns active products", async () => {
    const { token } = await createUserAndLogin();
    const category = await makeCategory();

    await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Camping Tent",
        description: "4-person tent",
        price: 2800,
        category: category._id,
        condition: "GOOD",
        location: "Jaipur, RJ",
      });

    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});