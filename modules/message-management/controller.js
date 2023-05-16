const { success, error } = require("../../helper/response");
const { Message, Conversation } = require("../../models");
const Validate = require("../../helper/get-errors-messages-validate");

async function getMessageByConversationId(req, res) {
  // await Message.deleteMany();
  // await Conversation.deleteMany();
  let query = {
    populate: "sender",
    sort: "-createdAt",
  };
  req.query = { ...req.query, ...query };
  let rules = {};
  let validate = await Validate(req.params, rules);
  if (validate) {
    return error(req, res, validate);
  }
  req.query.conversation = req.params.id;
  const result = await Message.getAll(req.query);
  return success(req, res, result);
}

async function createMessage(req, res) {
  req.body.conversation = req.params.id;
  req.body.sender = req.user.id;
  let rules = {
    content: ["required"],
    sendTime: ["required"],
  };
  let validate = await Validate(req.body, rules);
  if (validate) {
    return error(req, res, validate);
  }
  delete req.body._id;
  const result = await Message.createData(req.body);
  await result.populate("sender");
  const conversation = await Conversation.getByID(req.params.id);
  conversation.lastMessage = result._id;
  conversation.save();
  return success(req, res, result);
}

async function updateSeenMessages(req, res) {
  let rules = {
    messageIds: ["required"],
  };
  let validate = await Validate(req.body, rules);
  if (validate) {
    return error(req, res, validate);
  }
  const result = await Message.updateMany(
    { _id: { $in: req.body.messageIds } },
    { $set: { state: 2 } }
  );
  return success(req, res, "Update success");
}

module.exports = {
  getMessageByConversationId,
  createMessage,
  updateSeenMessages,
};
