/**
 * POST request validator
 * @param {Object} payload
 * @param {Object} schema
 * @returns {Object}
 */
exports.validator = (payload, schema) => {
  let result = {
    success: true,
    errors: [],
  };
  Object.keys(schema).forEach((key) => {
    if (!payload[key])
      return result.errors.push(`${key} does not exist on payload`);
    if (typeof payload[key] !== schema[key])
      return result.errors.push(
        `${key} is invalid type - expected ${schema[key]}, got ${typeof payload[
          key
        ]}`
      );
  });
  if (result.errors.length !== 0) result.success = false;
  return result;
};
