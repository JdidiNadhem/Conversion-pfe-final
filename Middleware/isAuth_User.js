const jwt = require("jsonwebtoken");
const userRequests = require("../Config/user");

exports.isAuth_User = async (req, res, next) => {
  try {
    // test token
    const token = req.headers["authorization"];
    // if the token is undefined =>
    if (!token) {
      return res.status(400).send({ errors: [{ msg: "N'est pas autorisé" }] });
    }
    // get the id from the token
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);

    // search the User
    const User = await userRequests.getUserById(decoded.id);
    // send not authorisation IF NOT User
    if (!User) {
      return res.status(400).send({ errors: [{ msg: "N'est pas autorisé" }] });
    }

    // if User exist
    const Role = await userRequests.getUserRole(decoded.id);
    const user = { User: User[0], Role: Role[0].type };
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ errors: [{ msg: "N'est pas autorisé", error }] });
  }
};
