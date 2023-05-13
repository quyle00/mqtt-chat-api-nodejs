const { success, error } = require("../../helper/response");
const { Users, VerifyCodes, AppDevices } = require("../../models");
const Validate = require("../../helper/get-errors-messages-validate");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken, verifyToken } = require("../../helper/jwt.helper");

async function register(req, res) {
  let rules = {
    fullname: ["required"],
    username: ["required"],
    password: ["required", "min:6"],
  };

  let validate = await Validate(req.body, rules);

  if (validate) {
    return error(req, res, validate);
  }

  req.body.username = req.body.username.toLowerCase();
  const user = await Users.getOneByParams({ username: req.body.username });
  if (user) {
    return error(req, res, "User is exist");
  }
  const hash = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
  req.body.avatar = "https://cdn-icons-png.flaticon.com/512/1077/1077114.png";
  req.body.password = hash;
  const result = await Users.createData(req.body);
  return success(req, res, result);
}

async function login(req, res) {
  let rules = {
    username: ["required"],
    password: ["required", "min:6"],
  };

  let validate = await Validate(req.body, rules);

  if (validate) {
    return error(req, res, validate);
  }
  req.body.username = req.body.username.toLowerCase();
  const { username, password } = req.body;
  const user = await Users.getOneByParams({ username: username });
  if (!user) {
    return error(req, res, "Login failed");
  }
  console.log(password);
  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    return error(req, res, "Login failed");
  }
  // if (req.body.deviceToken) {
  //   let device = await AppDevices.getOneByParams({
  //     deviceToken: req.body.deviceToken,
  //   });
  //   if (device) {
  //     await AppDevices.updateData(device._id, { user: user._id });
  //   } else {
  //     await AppDevices.createData({
  //       deviceToken: req.body.deviceToken,
  //       user: user._id,
  //     });
  //   }
  // }
  const token = await generateToken(user);
  user.token = token;
  delete user.password;
  return success(req, res, user);
}

async function getProlile(req, res) {
  const user = await Users.getOneByParams({ _id: req.user.id });
  return success(req, res, user);
}

module.exports = {
  register,
  login,
  getProlile,
};
