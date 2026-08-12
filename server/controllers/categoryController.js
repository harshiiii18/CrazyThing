const Category = require("../models/Category");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

exports.listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  return success(res, { message: "Categories fetched", data: categories });
});

exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon } = req.body;
  const slug = name.trim().toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");

  const existing = await Category.findOne({ slug });
  if (existing) throw new ApiError(409, "A category with this name already exists");

  const category = await Category.create({ name, slug, description, icon });
  return success(res, { status: 201, message: "Category created", data: category });
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new ApiError(404, "Category not found");
  return success(res, { message: "Category updated", data: category });
});

exports.disableCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!category) throw new ApiError(404, "Category not found");
  return success(res, { message: "Category disabled", data: category });
});
