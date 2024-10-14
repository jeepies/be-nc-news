const { resolve } = require("path");
const endpoints = require("../../endpoints.json");

exports.fetchEndpoints = () => {
  return new Promise((resolve, reject) => {
    if (endpoints == undefined) reject(new Error("failed to read endpoints"));
    resolve(endpoints);
  });
};
