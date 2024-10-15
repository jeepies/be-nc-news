const model = require("../models").users;

exports.getAll = (request, response, next) => {
  model
    .fetchAll()
    .then((data) => response.status(200).json({ users: data }))
    .catch((err) => next(err));
};

exports.getByUsername = (request, response, next) => {
  const { username } = request.params;

  // This is not required as params are always parsed as strings, and if a username of length
  // of zero was passed, the route would be /api/users, which is a valid route. I suppose its
  // the thought that counts?
  // if (typeof username !== "string" || username.length === 0)
  //   return response.status(400).json({ message: "Invalid username" });

  model.fetchByUsername(username).then((data) => {
    if (!data) return response.status(404).json({ message: "User not found" });
    else return response.status(200).json(data);
  });
};
