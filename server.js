const express = require("express");
const app = express();
// Allow cross origin  middleware

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// middleware global
app.use(express.json());

// Router
app.use("/api/user", require("./Routes/user"));
app.use("/api/admin", require("./Routes/admin"));

// Global envirenement
require("dotenv").config();

// Start server
// PORT
const PORT = process.env.PORT;

app.listen(PORT, (err) => {
  err ? console.log(err) : console.log(`Server is Running on PORT ${PORT}`);
});
