const knex = require("knex");

const connectKnex = knex({
  client: "sqlite3",
  connection: {
    filename: "./Models/Conversion.db3",
  },
  useNullAsDefault: true,
});

module.exports = connectKnex;
