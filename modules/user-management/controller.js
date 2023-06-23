const { success, error } = require("../../helper/response");
const { Users, VerifyCodes, AppDevices } = require("../../models");
const Validate = require("../../helper/get-errors-messages-validate");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken, verifyToken } = require("../../helper/jwt.helper");
const Constants = require("../../constants");
const _ = require("lodash");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const i18next = require("i18next");
const mailer = require("../../utils/mailer");
const request = require("request");

async function getAll(req, res) {
  let users = await Users.getAll(req.query);
  users.map((item) => {
    delete item.password;
  });
  //Remove current user
  users = users.filter((item) => item._id != req.user.id);
  return success(req, res, users);
}

module.exports = {
  getAll,
};
