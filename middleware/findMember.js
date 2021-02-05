const { Group } = require("../models/group");

module.exports = async function (req, res, next) {
  const group = await Group.findById(req.params.id);

  switch (req.body.request) {
    // join
    case "join":
      if (group) {
        let isJoined;

        group.members.includes(req.body.userId)
          ? (isJoined = true)
          : (isJoined = false);

        if (isJoined || isJoined === undefined) {
          return res
            .status(404)
            .send(
              "이미 가입했던 그룹입니다. 마이페이지에서 자세한 내용을 확인할 수 있습니다."
            );
        } else {
          req.group = group;
          next();
        }
      } else {
        return res
          .status(404)
          .send("확인되지 않는 유저입니다. 로그인 혹은 회원가입이 필요합니다.");
      }
      break;

    // sign-out
    case "signOut":
      if (group) {
        let isJoined;

        group.members.includes(req.body.userId)
          ? (isJoined = true)
          : (isJoined = false);

        if (!isJoined || isJoined === undefined) {
          return res
            .status(404)
            .send(
              "잘못된 접근입니다. 가입되어있지 않은 그룹입니다. 자세한 내용은 마이페이지를 통해 확인해주세요."
            );
        } else {
          req.group = group;
          next();
        }
      } else {
        return res
          .status(404)
          .send("확인되지 않는 유저입니다. 로그인 혹은 회원가입이 필요합니다.");
      }
      break;
  }
};
