const { User } = require("../models/user");

module.exports = async function (req, res, next) {
  const user = await User.findById(req.body.userId);

  console.log("req.body.request /////  " + req.body.request);
  switch (req.body.request) {
    // join
    case "join":
      console.log("join");
      if (user) {
        let isJoined;

        user.joinedGroups.includes(req.params.id)
          ? (isJoined = true)
          : (isJoined = false);

        if (isJoined || isJoined === undefined) {
          return res
            .status(404)
            .send(
              "이미 가입했던 그룹입니다. 마이페이지에서 자세한 내용을 확인할 수 있습니다."
            );
        } else {
          req.user = user;
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
      console.log("signOut");
      break;
  }
};
