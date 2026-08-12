const Address = require("../models/Address");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

exports.listAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
  return success(res, { message: "Addresses fetched", data: addresses });
});

exports.createAddress = asyncHandler(async (req, res) => {
  const isFirst = (await Address.countDocuments({ user: req.user._id })) === 0;
  if (req.body.isDefault || isFirst) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }
  const address = await Address.create({
    ...req.body,
    user: req.user._id,
    isDefault: req.body.isDefault || isFirst,
  });
  return success(res, { status: 201, message: "Address added", data: address });
});

exports.updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
  if (!address) throw new ApiError(404, "Address not found");

  if (req.body.isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }
  Object.assign(address, req.body);
  await address.save();
  return success(res, { message: "Address updated", data: address });
});

exports.deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!address) throw new ApiError(404, "Address not found");
  return success(res, { message: "Address removed" });
});
