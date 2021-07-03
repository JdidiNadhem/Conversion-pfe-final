const knex = require("./knexfile");

// GET ANALOGIE FILE
const getAnalogieFile = (id_user) => {
  return knex("files")
    .where({ id_user, type: "ANALOGIE" })
    .select("*")
    .orderBy("date_creation", "asc");
};

// SELECT COUNT ANALOGIE FILES
const getAnalogieFileNumber = () => {
  return knex("files").count("type", { as: "Nb" }).where({ type: "ANALOGIE" });
};

// INSERT CONFIGURATION IN FILES
const configure = (file) => {
  return knex("files").insert(file);
};

// SELECT CONVERSIONS
const getConversions = () => {
  return knex("conversions")
    .join("users", "conversions.id_user", "users.id")
    .select(
      "users.id As User_id",
      "users.nom ",
      "users.prenom",
      "users.email",
      "conversions.id As Conversion_id",
      "conversions.xml_path",
      "conversions.jrxml_path",
      "conversions.date_conversion"
    );
};

module.exports = {
  getAnalogieFile,
  getAnalogieFileNumber,
  configure,
  getConversions,
};
