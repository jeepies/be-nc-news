const exp = require("constants");

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
    let expected = schema[key].split(",");
    let optional = false;

    if (expected.includes("optional")) {
      optional = true;
      expected.splice(expected.indexOf("optional"), 1);
    }

    expected = expected[0];

    if (!payload[key] && !optional)
      return result.errors.push(`${key} does not exist on payload`);

    if (typeof payload[key] !== expected && !(optional && !payload[key]))
      return result.errors.push(
        `${key} is invalid type - expected ${expected}, got ${typeof payload[
          key
        ]}`
      );
  });
  if (result.errors.length !== 0) result.success = false;
  return result;
};
