const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
// Get path module
const path = require("path");

const userRequests = require("../Config/user");

// CONTROLLER REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    // req.body : {nom,prenom,email,login,motdepasse}
    const user = req.body;
    // check if the email is not found in the database
    const findUser = await userRequests.getUserByEmail(user.email);
    if (findUser.length > 0) {
      return res
        .status(400)
        .send({ errors: [{ msg: "Utilisateur déjà enregistré !" }] });
    }

    // Hash password

    const hashedpassword = bcrypt.hashSync(user.motdepasse, salt);
    user.motdepasse = hashedpassword;

    // Insert User in database

    user.id = Date.now();
    await userRequests.createUser(user);
    const role = { id_role: user.id, type: "USER" };
    await userRequests.createUserRole(role);
    // create a token using json webtoken
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "3h" }
    );

    res.status(200).send({
      msg: "Utilisateur enregistré avec succès !",
      User: user,
      Role: role.type,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      errors: [{ msg: "Ne peut pas enregistrer l'utilisateur", error }],
    });
  }
};

// CONTROLLER LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    // req.body login,motdepasse
    const { login, motdepasse } = req.body;
    // Check if user exist
    const finduser = await userRequests.getUserByLogin(login);
    if (finduser.length === 0) {
      return res
        .status(400)
        .send({ errors: [{ msg: "Mauvaise combinaison" }] });
    }

    // Check password
    const result = await bcrypt.compare(motdepasse, finduser[0].motdepasse);
    if (!result) {
      res.status(400).send({ errors: [{ msg: "Mauvaise combinaison" }] });
      return;
    }
    // find User Role
    const role = await userRequests.getUserRole(finduser[0].id);

    // create Token
    const token = jwt.sign(
      {
        id: finduser[0].id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "3h" }
    );

    res.status(200).send({
      msg: "Authentification avec success",
      User: finduser[0],
      Role: role[0].type,
      token,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ errors: [{ msg: "Ne peut pas obtenir l'utilisateur", error }] });
  }
};

// CONTROLLER GET USER BY ID
exports.getUserById = async (req, res) => {
  try {
    // Get id user from params
    const { id } = req.params;
    // find user by id
    const finduser = await userRequests.getUserById(id);
    // Check if user exist
    if (finduser.length === 0) {
      return res.status(400).send({ msg: "Utilisateur introuvable !" });
    }
    // find user role
    const findUserRole = await userRequests.getUserRole(id);
    res.status(200).send({
      msg: "Voici l'utilisateur",
      User: finduser[0],
      Role: findUserRole[0].type,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ errors: [{ msg: "Ne peut pas obtenir l'utilisateur", error }] });
  }
};

// CONTROLLER GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    // find users
    const findusers = await userRequests.getAllUsers();

    res.status(200).send({
      msg: "La liste des utilisateurs",
      Users: findusers,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      errors: [
        { msg: "Ne peut pas obtenir la liste des utilisateurs !", error },
      ],
    });
  }
};

// CONTROLLER UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    // get user id from req.params
    const { id } = req.params;
    // get modifications from req.body
    const modifications = req.body;
    // find user
    const finduser = await userRequests.getUserById(id);
    if (finduser.length === 0) {
      return res.status(400).send({ msg: "Utilisateur non trouvé !" });
    }
    // update
    await userRequests.updateUser(modifications, id);
    res.status(200).send({
      msg: "Utilisateur modifié avec succès",
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ errors: [{ msg: "Ne peut pas modifier l'utilisateur", error }] });
  }
};

// CONTROLLER UPDATE USER PASSWORD
exports.updateUserPassword = async (req, res) => {
  try {
    // get user id from req.params
    const { id } = req.params;
    // get passwords from req.body
    const motdepasse = req.body.motdepasse;
    const nouveaumotdepasse = req.body.nouveaumotdepasse;
    // find user
    const finduser = await userRequests.getUserById(id);
    if (finduser.length === 0) {
      return res.status(400).send({ msg: "Utilisateur introuvable !" });
    }
    // Check password
    const result = await bcrypt.compare(motdepasse, finduser[0].motdepasse);
    if (!result) {
      res.status(400).send({ errors: [{ msg: "Mot de passe non valide" }] });
      return;
    }
    // Hash password
    const hashedpassword = bcrypt.hashSync(nouveaumotdepasse, salt);

    // update password
    await userRequests.updateUserPassword(hashedpassword, id);
    res.status(200).send({
      msg: "Mot de passe utilisateur modifié avec succès",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      errors: [
        {
          msg: "ne peut pas modifier le mot de passe de l'utilisateur",
          error,
        },
      ],
    });
  }
};

// CONTROLLER DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    // get id user from params
    const { id } = req.params;
    // get motdepasse from req.body
    const { motdepasse } = req.body;
    // finduser
    const finduser = await userRequests.getUserById(id);
    if (finduser.length === 0) {
      return res.status(400).send({ msg: "Utilisateur introuvable" });
    }
    // Check password
    const result = await bcrypt.compare(motdepasse, finduser[0].motdepasse);
    if (!result) {
      return res
        .status(400)
        .send({ errors: [{ msg: "Mauvaise combinaison" }] });
    }

    // delete user
    await userRequests.deleteUser(id);
    await userRequests.deleteUserRole(id);

    res.status(200).send({
      msg: "Utilisateur supprimé avec succès",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      errors: [{ msg: "Ne peut pas supprimer l'utilisateur ", error }],
    });
  }
};

// CONTROLLER GET USER CONVERSIONS
exports.getUserConversions = async (req, res) => {
  try {
    // Get user from req
    const { user } = req;
    // Get user conversions
    const Conversions = await userRequests.getConversionUser(user.User.id);
    // extract filename from jrxmlPath and xmlPath
    Conversions.forEach((el) => {
      el.xml_filename = path.basename(el.xml_path);
      el.jrxml_filename = path.basename(el.jrxml_path);
      delete el.xml_path;
      delete el.jrxml_path;
    });
    res.status(200).send({
      msg: "Les conversion de l'utilisateur",
      Conversions,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      errors: [{ msg: "Ne peut pas obtenir la liste des conversions ", error }],
    });
  }
};

// CONTROLLER DOWNLOAD JRXML
exports.downloadJrxml = async (req, res) => {
  try {
    // get path from req.params
    const { filename } = req.params;
    res.download("Files/Jrxml/" + filename, filename);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      errors: [{ msg: "Ne peut pas télécharger le fichier jrxml", error }],
    });
  }
};

// CONTROLLER GET STATISTICS
exports.getStatistics = async (req, res) => {
  try {
    // get number of users
    const Users = await userRequests.getNumberUsers();
    // get number of conversions
    const Conversions = await userRequests.getNumberConversions();
    res.status(200).send({
      msg: "Statistiques:",
      Users: Users[0].Users,
      Conversions: Conversions[0].Conversions,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      errors: [{ msg: "Ne peut pas obtenir le statistique ", error }],
    });
  }
};
