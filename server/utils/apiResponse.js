exports.success = (res, { message = "Success", data = {}, status = 200, meta }) => {
  const body = { success: true, message, data };
  if (meta) body.meta = meta;
  return res.status(status).json(body);
};

exports.failure = (res, { message = "Something went wrong", status = 400, errors = [] }) => {
  return res.status(status).json({ success: false, message, errors });
};
