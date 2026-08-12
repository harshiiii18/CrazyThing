const { body } = require("express-validator");

exports.createProductValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("category").notEmpty().withMessage("Category is required"),
  body("condition")
    .isIn(["NEW", "LIKE_NEW", "GOOD", "FAIR", "USED"])
    .withMessage("Invalid condition"),
  body("location").trim().notEmpty().withMessage("Location is required"),
];
