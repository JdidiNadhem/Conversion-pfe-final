const { validationResult, check } = require("express-validator");

exports.configureValidation = () => [
  check("configuration", "Configuration est important!").not().isEmpty(),
];

exports.validation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
