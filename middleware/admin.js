module.exports = function (req, res, next) {
  if (!req.user.isAdmin)
    return res.status(403).send("관리자 권한이 필요합니다.");

  next();
};
