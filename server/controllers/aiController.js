const Category = require("../models/Category");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");
const aiService = require("../services/aiService");

// POST /api/ai/listing-assist  { input: "raw seller notes" }
exports.listingAssist = asyncHandler(async (req, res) => {
  const { input } = req.body;
  if (!input || input.trim().length < 5) {
    throw new ApiError(400, "Describe the item in a bit more detail first");
  }

  const categories = await Category.find({ isActive: true }).select("name");
  const categoryNames = categories.map((c) => c.name);

  const suggestion = await aiService.generateListingSuggestions({
    rawInput: input,
    categoryNames,
  });

  // Map the suggested category name back to a real Category _id so the
  // frontend can preselect it in the dropdown.
  const matchedCategory = categories.find(
    (c) => c.name.toLowerCase() === (suggestion.category || "").toLowerCase()
  );

  return success(res, {
    message: "Suggestions generated",
    data: {
      ...suggestion,
      categoryId: matchedCategory?._id || null,
      mockMode: aiService.isMockMode,
    },
  });
});