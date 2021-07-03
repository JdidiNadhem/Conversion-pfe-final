let fs = require("fs");
let convert = require("xml-js");
let xml2jrxml = require("./xml2jrxml.js");

// GET ADMIN REQUESTS
const userRequests = require("../Config/user");
// GET CONVERSION REQUESTS
const conversionRequests = require("../Config/conversion");
// GET FILE REQUESTS
const fileRequests = require("../Config/upload");

const exec = async (path, id_user, Nb) => {
  try {
    // Get analogie file from database
    const analogiefile = await userRequests.getAnalogieFile();
    // GET ANALOGIE JSON FORMAT
    let data = fs.readFileSync(analogiefile[0].path, "utf8"); // ANALOGIE FORMAT TEXT
    let analogie = JSON.parse(data); // ANALOGIE FORMAT JSON
    let xml = fs.readFileSync(path, "utf8");
    let result = convert.xml2json(xml, { compact: true, spaces: 4 });
    // GET XML-RDF JSON FORMAT
    let rdf = JSON.parse(result); //XML FORMAT JSON
    //START CONVERSION
    xml2jrxml.convert(analogie, rdf, id_user, Nb);
  } catch (error) {
    console.log(error);
  }
};

// CONTROLLER CONVERSION
exports.convert = async (req, res) => {
  try {
    // Get user from req
    const { user } = req;
    // Get path from req.body
    const { path } = req.body;
    // Get path from database
    const xmlfile = await conversionRequests.getXmlFile(path, user.User.id);
    // Get user conversions number
    const nbConversions = await userRequests.getConversionNumber(user.User.id);
    const Nb = nbConversions[0].Nb;
    exec(xmlfile[0].path, user.User.id, Nb);
    // add conversion to database table conversion
    const conversion = {
      id_user: user.User.id,
      xml_path: path,
      jrxml_path: `Files/Jrxml/jrxml-${user.User.id}-(${Nb + 1}).jrxml`,
      date_conversion: Date(),
    };
    await conversionRequests.createConversion(conversion);
    // add jrxml file to database
    const file = {
      id_user: user.User.id,
      path: `Files/Jrxml/jrxml-${user.User.id}.jrxml`,
      date_creation: Date(),
      type: "JRXML",
    };
    await fileRequests.createFile(file);
    res.status(200).send({
      msg: "Fichier converti avec succès !",
      filename: `jrxml-${user.User.id}-(${Nb + 1}).jrxml`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      errors: [{ msg: "Ne peut pas convertir le fichier analogie !", error }],
    });
  }
};
