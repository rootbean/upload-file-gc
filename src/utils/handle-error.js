exports.handleError = (request, h, err) => {
  if (err.isJoi && Array.isArray(err.details) && err.details.length > 0) {
    const invalidItem = err.details[0];
    const data = `Schema violation: ${invalidItem.path}`;
    const message = err.details;
    return h.response({ data, message })
      .code(400)
      .takeover();
  }
  return h.response(err)
    .takeover();
};
