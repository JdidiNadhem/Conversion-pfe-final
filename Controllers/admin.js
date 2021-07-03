const fs = require("fs");
// Get path module
const path = require("path");
const adminRequests = require("../Config/admin");

// CONTROLLER GET ANALOGIE FILE
exports.getAnalogieFile = async (req, res) => {
  try {
    //  Get user from req
    const user = req.user;
    // Check if admin
    if (!user.Role === "ADMIN") {
      return res.status(400).send({ msg: "Utilisateur Non autorisé" });
    }
    // Get analogie file from database
    const analogieFile = await adminRequests.getAnalogieFile(user.User.id);
    // Get analogie file from folder
    const analogie = fs.readFileSync(`${analogieFile[0].path}`);
    // Convert analogie to json
    const analogiejson = JSON.parse(analogie);
    // Send analogie file
    res.status(200).send({ msg: "Fichier analogie", Analogie: analogiejson });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      errors: [{ msg: "Impossible d'obtenir le fichier analogique", error }],
    });
  }
};

// CONTROLLER GET CONVERSIONS
exports.getConversions = async (req, res) => {
  try {
    // get user from req
    const { user } = req;
    // Check if Admin
    if (!user.Role === "ADMIN") {
      return res.status(400).send({ msg: "N'est pas autorisé" });
    }
    // Get conversions from database
    const Conversions = await adminRequests.getConversions();
    // extract filename from jrxmlPath and xmlPath
    Conversions.forEach((el) => {
      el.xml_filename = path.basename(el.xml_path);
      el.jrxml_filename = path.basename(el.jrxml_path);
      delete el.xml_path;
      delete el.jrxml_path;
    });
    res.status(200).send({ msg: "Liste des conversions", Conversions });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      errors: [{ msg: "Impossible d'obtenir la liste des conversions", error }],
    });
  }
};

// CONTROLLER CONFIGURATION ANALOGIE FILE
exports.configAnalogieFile = async (req, res) => {
  try {
    // Get user from req
    const { user } = req;
    // Get configuration from req.body
    const { configuration } = req.body;
    // Get analogie file from database
    const analogieData = await adminRequests.getAnalogieFile(user.User.id);
    // Get analogie file content
    const analogie = fs.readFileSync(`${analogieData[0].path}`);
    // Convert analogie content to json
    const analogiejson = JSON.parse(analogie);
    // Compare analogie json with configuration
    if (JSON.stringify(analogiejson) === JSON.stringify(configuration)) {
      return res.status(200).send({
        msg: "Il n'y a eu aucun changement dans le fichier d'analogie",
        Analogie: analogiejson,
      });
    } else {
      // Get number of analogie files
      const numberAnalogie = await adminRequests.getAnalogieFileNumber();
      // set name of analogie file
      const filename = `analogie(${numberAnalogie[0].Nb + 1}).json`;
      // Convert configuration to string
      const convstring = JSON.stringify(configuration);
      // Create analogie file in Analogie folder
      fs.writeFileSync(`Files/Analogie/${filename}`, convstring);
      // Add configuration in database
      await adminRequests.configure({
        id_user: user.User.id,
        path: `Files/Analogie/${filename}`,
        date_creation: Date(),
        type: "ANALOGIE",
      });
      // get new analogie content
      const newanalogie = fs.readFileSync(`Files/Analogie/${filename}`);
      // Convert analogie content to json
      const analogiejson = JSON.parse(newanalogie);
      res.status(200).send({
        msg: "Fichier analogique mis à jour avec succès !",
        Analogie: analogiejson,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      errors: [
        { msg: "Impossible de configurer le fichier analogique", error },
      ],
    });
  }
};
