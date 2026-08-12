require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");

const CATEGORY_NAMES = [
  "Electronics", "Mobiles", "Laptops", "Gaming", "Fashion", "Furniture",
  "Home & Kitchen", "Books", "Sports", "Beauty", "Vehicles", "Collectibles",
  "Pets", "Accessories", "Services", "Other",
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected for seeding...");

  await Promise.all([User.deleteMany({}), Category.deleteMany({}), Product.deleteMany({})]);

  const admin = await User.create({
    name: "CrazyThing Admin",
    username: "admin",
    email: "admin@crazything.dev",
    password: "AdminPass123",
    role: "ADMIN",
    isEmailVerified: true,
  });

  const seller = await User.create({
    name: "Aarav Mehta",
    username: "aarav_m",
    email: "seller@crazything.dev",
    password: "SellerPass123",
    isEmailVerified: true,
    sellerVerification: { status: "VERIFIED", requestedAt: new Date(), reviewedAt: new Date() },
    location: "Jaipur, RJ",
  });

  const categories = await Category.insertMany(
    CATEGORY_NAMES.map((name) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and"),
    }))
  );

  const electronics = categories.find((c) => c.name === "Electronics");
  const mobiles = categories.find((c) => c.name === "Mobiles");

  await Product.insertMany([
    {
      seller: seller._id,
      title: "Apple iPhone 13 128GB — Good Condition",
      description: "Battery health 88%, no scratches, comes with original box and charger.",
      price: 32999,
      category: mobiles._id,
      condition: "GOOD",
      location: "Jaipur, RJ",
      images: [{ url: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=600&q=80" }],
    },
    {
      seller: seller._id,
      title: "Sony WH-1000XM4 Wireless Headphones",
      description: "Barely used, includes carrying case and cables.",
      price: 14500,
      category: electronics._id,
      condition: "LIKE_NEW",
      location: "Jaipur, RJ",
      images: [{ url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80" }],
    },
  ]);

  console.log("Seed complete:");
  console.log(`  Admin login: admin@crazything.dev / AdminPass123`);
  console.log(`  Seller login: seller@crazything.dev / SellerPass123`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
