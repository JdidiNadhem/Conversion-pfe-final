const knex = require("./knexfile");

// INSERT USER
const createUser = (user) => {
  return knex("users").insert(user);
};

// INSERT ROLE
const createUserRole = (role) => {
  return knex("roles").insert(role);
};

// SELECT USER BY EMAIL
const getUserByEmail = (email) => {
  return knex("users").where({ email }).select("*");
};

// SELECT USER BY LOGIN
const getUserByLogin = (login) => {
  return knex("users").where({ login }).select("*");
};

// SELECT USER BY ID
const getUserById = (id) => {
  return knex("users").where({ id }).select("*");
};

// SELECT USER ROLE
const getUserRole = (id_role) => {
  return knex("roles").where({ id_role }).select("type");
};

// SELECT ALL USERS
const getAllUsers = () => {
  return knex("users")
    .join("roles", "users.id", "roles.id_role")
    .select("users.*", "roles.type As Role");
};

// UPDATE USER
const updateUser = (modifications, id) => {
  return knex("users")
    .where({ id })
    .update({ ...modifications });
};

// UPDATE USER PASSWORD
const updateUserPassword = (hashedpassword, id) => {
  return knex("users").where({ id }).update({ motdepasse: hashedpassword });
};

// DELETE USER
const deleteUser = (id) => {
  return knex("users").del().where({ id });
};

// DELETE USER ROLE
const deleteUserRole = (id_role) => {
  return knex("roles").del().where({ id_role });
};

// GET ANALOGIE FILE
const getAnalogieFile = () => {
  return knex("files")
    .where({ type: "ANALOGIE" })
    .select("*")
    .orderBy("date_creation", "asc");
};

// GET CONVERSION NUMBER
const getConversionNumber = (id_user) => {
  return knex("conversions").count("id", { as: "Nb" }).where({ id_user });
};

// GET CONVERSIONS OF USER
const getConversionUser = (id_user) => {
  return knex("conversions")
    .where({ id_user })
    .select("id_user", "xml_path", "jrxml_path", "date_conversion");
};

// GET NUMBER OF USERS
const getNumberUsers = () => {
  return knex("users").count("id", { as: "Users" });
};

// GET NUMBER OF CONVERSIONS
const getNumberConversions = () => {
  return knex("conversions").count("id", { as: "Conversions" });
};
module.exports = {
  createUser,
  createUserRole,
  getAllUsers,
  getUserByEmail,
  getUserByLogin,
  getUserRole,
  getUserById,
  updateUser,
  updateUserPassword,
  deleteUser,
  deleteUserRole,
  getAnalogieFile,
  getConversionNumber,
  getConversionUser,
  getNumberUsers,
  getNumberConversions,
};
