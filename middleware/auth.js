const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).send("접속 거부. 접근 권한(토큰)이 없습니다.");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;

    next();
  } catch (ex) {
    res.status(400).send("잘못된 토큰입니다.");
  }
};
