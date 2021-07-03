const knex = require("./knexfile");

const createConversion = (conversion) => {
  return knex("conversions").insert(conversion);
};

const getXmlFile = (path, id_user) => {
  return knex("files").select("*").where({ path, id_user });
};

module.exports = {
  createConversion,
  getXmlFile,
};
