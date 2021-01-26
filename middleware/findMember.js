const { Group } = require("../models/group");

module.exports = async function (req, res, next) {
  let flag = true;
  await Group.findOne({ members: req.body.userId }, () => {
    flag = false;
    return res
      .status(404)
      .send(
        "이미 소속된 그룹입니다. 마이페이지에서 자세한 내용을 확인할 수 있습니다."
      );
  });

  console.log(flag);
  if (flag) next();
};
