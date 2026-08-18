require("./setup");
const request = require("supertest");
const app = require("../app");
const { createUserAndLogin } = require("./helpers");
const Category = require("../models/Category");

describe("Cart — server-authoritative pricing", () => {
  test("adding an item to cart uses the server's price, not a client-supplied one", async () => {
    const seller = await createUserAndLogin();
    const buyer = await createUserAndLogin();
    const category = await Category.create({ name: "Books", slug: "books" });

    const product = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${seller.token}`)
      .send({
        title: "Used Textbook",
        description: "Some wear on the cover",
        price: 500,
        category: category._id,
        condition: "FAIR",
        location: "Delhi, DL",
        quantity: 5, // enough stock for the quantity=2 request below
      });

    // Buyer adds it to cart — even if a malicious client tried to send a
    // different price, the endpoint doesn't accept a price field at all.
    const cartRes = await request(app)
      .post("/api/cart/items")
      .set("Authorization", `Bearer ${buyer.token}`)
      .send({ productId: product.body.data._id, quantity: 2 });

    expect(cartRes.status).toBe(200);
    expect(cartRes.body.data.subtotal).toBe(1000); // 500 * 2, from the DB
  });

  test("cart cannot add more quantity than available stock", async () => {
    const seller = await createUserAndLogin();
    const buyer = await createUserAndLogin();
    const category = await Category.create({ name: "Sports", slug: "sports" });

    const product = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${seller.token}`)
      .send({
        title: "Mountain Bike",
        description: "One available",
        price: 26000,
        category: category._id,
        condition: "GOOD",
        location: "Pune, MH",
        quantity: 1,
      });

    const res = await request(app)
      .post("/api/cart/items")
      .set("Authorization", `Bearer ${buyer.token}`)
      .send({ productId: product.body.data._id, quantity: 5 });

    expect(res.status).toBe(400);
  });
});