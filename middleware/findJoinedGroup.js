const { User } = require("../models/user");

module.exports = async function (req, res, next) {
  await User.findOne({ joinedGroups: req.params.id }, () => {
    return res
      .status(404)
      .send(
        "이미 가입했던 그룹입니다. 마이페이지에서 자세한 내용을 확인할 수 있습니다."
      );
  });

  next();
};
