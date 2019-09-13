const jwt = require("jsonwebtoken");

const authFailed = (isAuth, next) => {
  isAuth = false;
  return next();
};

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return authFailed(req.isAuth, next);
  }

  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    return authFailed(req.isAuth, next);
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, "!!!$$SUPER_DUPER_SECRET_KEY$$!!!");
  } catch (err) {
    return authFailed(req.isAuth, next);
  }

  if (!decodedToken) {
    return authFailed(req.isAuth, next);
  }

  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};
