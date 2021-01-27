const { Group } = require("../models/group");

module.exports = async function (req, res, next) {
  const group = await Group.findById(req.params.id);

  if (group) {
    let isJoined;

    group.members.includes(req.body.userId)
      ? (isJoined = true)
      : (isJoined = false);

    if (isJoined || isJoined === "undefined") {
      return res
        .status(404)
        .send(
          "이미 소속된 그룹입니다. 마이페이지에서 자세한 내용을 확인할 수 있습니다."
        );
    } else {
      // req.group = group;
      next();
    }
  } else {
    return res
      .status(400)
      .send("존재하지 않는 그룹입니다. 다시 한 번 확인해주세요.");
  }
};
