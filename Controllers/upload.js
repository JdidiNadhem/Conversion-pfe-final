const multer = require("multer");
const path = require("path");

// SET STORAGE AND NAME OF XML FILE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Files/Xml");
  },
  filename: (req, file, cb) => {
    cb(null, `xml-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// CHECK FILE TYPE
const checkFileType = (file, cb) => {
  const filetypes = /xml/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb("veuillez importer une fichier xml !");
  }
};

//UPLOAD FILE
module.exports = upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});
