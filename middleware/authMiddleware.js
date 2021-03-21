const jwt = require("jsonwebtoken");
const errorCreator = require("../errorCreator/errorCreator");

//FOR AUTHENTICATION PURPOSES

exports.checkAuthenticated = (req, res, next) => {
  if (!req.get("Authorization")) {
    return next(errorCreator("Unauthenticarted user!", 500));
  }

  const token = req.get("Authorization").split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.decode(token, "BAMBORA-SHOP-SECRET");
  } catch (err) {
    return next(errorCreator("Unauthenticated user!", 500));
  }

  if (!decodedToken) {
    return next(errorCreator("Unauthenticated User!", 500));
  }
  req.userId = decodedToken.userId;
  next();
};
