const express = require("express");
const router = express.Router();

// IMPORT UPLOAD CONTROLLER
const upload = require("../Controllers/upload");

// IMPORT UPLOAD REQUESTS
const uploadRequests = require("../Config/upload");

// IMPORT CONVERT CONTROLLER
const { convert } = require("../Controllers/conversion");

// Import user controllers
const {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  updateUser,
  updateUserPassword,
  deleteUser,
  getUserConversions,
  downloadJrxml,
  getStatistics,
} = require("../Controllers/user");

// Import user Middleware
const { isAuth_User } = require("../Middleware/isAuth_User");

// Import user Validations
const {
  registerValidation,
  validation,
  loginValidation,
  updateUserValidation,
  updateUserPasswordValidation,
  deleteUserValidation,
  conversionValidation,
} = require("../Middleware/userValidation");

// *********************************
//                                 *
//          USER ROUTES            *
//                                 *
// *********************************

// @Desc: REGISTER
// @Method: POST
// @PATH: /api/user/register
// DATA : {nom,prenom,email,login,motdepasse}

router.post("/register", registerValidation(), validation, registerUser);

// @Desc: LOGIN
// @Method: POST
// @PATH: /api/user/login
// DATA : login,motdepasse

router.post("/login", loginValidation(), validation, loginUser);

// @Desc: GET USER BY ID
// @Method: GET
// @PATH: /api/user/get_user/:id
// DATA : req.params{id}

router.get("/get_user/:id", getUserById);

// @Desc: GET ALL UERS
// @Method: GET
// @PATH: /api/user/get_users

router.get("/get_users", getAllUsers);

// @Desc: UPDATE USER
// @Method: PUT
// @PATH: /api/user/update_user/:id
// @DATA: req.header{token}, req.params{id}, req.body{nom,prenom,email,motdepasse}

router.put(
  "/update_user/:id",
  isAuth_User,
  updateUserValidation(),
  validation,
  updateUser
);

// @Desc: UPDATE USER PASSWORD
// @Method: PUT
// @PATH: /api/user/update_user_password/:id
// @DATA: req.header{token}, req.params{id}, req.body{motdepasse,nouveaumotdepasse}

router.put(
  "/update_user_password/:id",
  isAuth_User,
  updateUserPasswordValidation(),
  validation,
  updateUserPassword
);

// @Desc: DELETE USER
// @Method: DELETE
// @PATH: /api/user/delete_user/:id
// @DATA: req.header{token}, req.params{id}, req.body{motdepasse}

router.delete(
  "/delete_user/:id",
  isAuth_User,
  deleteUserValidation(),
  validation,
  deleteUser
);

// @Desc: CURRENT USER
// @Method: GET
// @PATH: /api/user/current
// @DATA: req.headers{token}

router.get("/current", isAuth_User, (req, res) => {
  res.send(req.user);
});

// @Desc: UPLOAD
// @Method: POST
// @PATH: /api/user/upload
// DATA : req.headers{token}

router.post("/upload", isAuth_User, upload.single("file"), async (req, res) => {
  try {
    // Get user from req
    const { user } = req;
    // File Path
    const { path } = req.file;
    // TYPE
    const type = "XML";
    // DATE
    const date_creation = Date();
    // Save upload file in database
    await uploadRequests.createFile({
      id_user: user.User.id,
      path,
      date_creation,
      type,
    });
    res.status(200).send({ msg: "File uploaded successfully !", path });
  } catch (error) {
    console.log(error);
    res.send({ msg: "Can not upload xml", error });
  }
});

// @Desc: CONVERSION
// @Method: POST
// @PATH: /api/user/conversion
// @DATA : req.body{path}

router.post(
  "/conversion",
  conversionValidation(),
  validation,
  isAuth_User,
  convert
);

// @Desc: GET USER CONVERSIONS
// @Method: GET
// @PATH: /api/user/get_conversions
// @DATA : req.headers{token}

router.get("/get_conversions", isAuth_User, getUserConversions);

// @Desc: DOWNLOAD JRXML FILE
// @Method: POST
// @PATH: /api/user/download_jrxml/:filename
// @DATA :  req.params{filename}

router.get("/download_jrxml/:filename", downloadJrxml);

// @Desc: GET STATISTIQUES
// @Method: GET
// @PATH: /api/user/statistiques

router.get("/statistiques", getStatistics);

module.exports = router;
