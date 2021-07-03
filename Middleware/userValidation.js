const { validationResult, check } = require("express-validator");

exports.registerValidation = () => [
  check("nom", "Nom est important").not().isEmpty(),

  check("prenom", "Prenom est important").not().isEmpty(),

  check("email", "Email est important").not().isEmpty(),
  check("email", "Entrer un email valide").isEmail(),

  check("login", "Login est important").not().isEmpty(),
  check("login", "Le login doit avoir plus de 6 caractères").isLength({
    min: 6,
  }),

  check("motdepasse", "Mot de passe est important").not().isEmpty(),
  check("motdepasse", "Mot de passe doit avoir plus de 6 caractères").isLength({
    min: 6,
  }),
];

exports.loginValidation = () => [
  check("login", "Login est important").not().isEmpty(),

  check("motdepasse", "Mot de passe est important").not().isEmpty(),
];

exports.updateUserValidation = () => [
  check("nom", "Nom est important").not().isEmpty(),

  check("prenom", "Prenom est important").not().isEmpty(),

  check("email", "Email est important").not().isEmpty(),
  check("email", "Entrer un email valide").isEmail(),

  check("login", "Login est important").not().isEmpty(),
  check("login", "Le login doit avoir plus de 6 caractères").isLength({
    min: 6,
  }),
];

exports.updateUserPasswordValidation = () => [
  check("motdepasse", "Mot de passe est important").not().isEmpty(),

  check("nouveaumotdepasse", "Nouveau mot de passe est important")
    .not()
    .isEmpty(),
  check(
    "nouveaumotdepasse",
    "Nouveau mot de passe doit avoir plus de 6 caractères"
  ).isLength({
    min: 6,
  }),
];

exports.deleteUserValidation = () => [
  check("motdepasse", "Mot de passe est important").not().isEmpty(),
];

exports.conversionValidation = () => [
  check("path", "Path est important").not().isEmpty(),
];

exports.validation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
