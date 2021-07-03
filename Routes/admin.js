const express = require("express");
const router = express.Router();

const {
  getAnalogieFile,
  configAnalogieFile,
  getConversions,
} = require("../Controllers/admin");
const {
  configureValidation,
  validation,
} = require("../Middleware/adminValidation");
const { isAuth_User } = require("../Middleware/isAuth_User");

// *********************************
//                                 *
//          ADMIN ROUTES           *
//                                 *
// *********************************

// @Desc: GET ANALOGIE FILE
// @Method: GET
// @PATH: /api/admin/get_analogie
// DATA : req.headers{token}

router.get("/get_analogie", isAuth_User, getAnalogieFile);

// @Desc: CONFIGURE ANALOGIE FILE
// @Method: POST
// @PATH: /api/admin/configure
// DATA : req.headers{token} req.body{configuration}

router.post(
  "/configure",
  isAuth_User,
  configureValidation(),
  validation,
  configAnalogieFile
);

// @Desc: GET CONVERSIONS
// @Method: GET
// @PATH: /api/admin/get_conversions
// DATA : req.headers{token}

router.get("/get_conversions", isAuth_User, getConversions);

module.exports = router;
