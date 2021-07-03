const knex = require("./knexfile");

const createFile = (file) => {
  return knex("files").insert(file);
};

module.exports = {
  createFile,
};
