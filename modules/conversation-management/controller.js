const { success, error } = require("../../helper/response");
const { Conversation, Message } = require("../../models");
const Validate = require("../../helper/get-errors-messages-validate");

async function createConversation(req, res) {
  let rules = {
    participants: ["required"],
  };

  let validate = await Validate(req.body, rules);

  if (validate) {
    return error(req, res, validate);
  }

  // Find Conversation if exist with participants
  const existConversation = await Conversation.getOneByParams({
    participants: {
      $all: req.body.participants,
    },
  });

  if (existConversation) {
    return error(req, res, "Conversation already exist");
  }

  const conversation = await Conversation.createData(req.body);
  await conversation.populate("participants");
  let result = conversation.toObject();
  delete result.lastMessage;
  return success(req, res, result);
}

async function getConversationsByUser(req, res) {
  // await Message.deleteMany();
  // await Conversation.deleteMany();
  let query = {
    participants: req.user.id,
    populate: "participants,lastMessage.sender",
  };
  query = { ...query, ...req.query };
  const result = await Conversation.getAll(query);
  result.map((item) => {
    item.name = item.participants.filter(
      (participant) => participant._id != req.user.id
    )[0].fullname;
    if (item.lastMessage) {
      item.lastMessage.isMine = item.lastMessage.sender._id == req.user.id;
      // Remove reply message for testing
      delete item.lastMessage.reply;
    }
  });
  return success(req, res, result);
}

async function getConversationDetail(req, res) {
  const conversation = await Conversation.getOneByParams({
    _id: req.params.id,
  });
  await conversation.populate("participants");
  let result = conversation.toObject();
  delete result.lastMessage;
  return success(req, res, result);
}

async function getConversationDetailByPartnerId(req, res) {
  req.body.participants = [req.user.id, req.params.partnerId];

  const conversation = await Conversation.getOneByParams({
    participants: {
      $all: req.body.participants,
    },
  });
  if (!conversation) {
    return error(req, res, "Conversation not found");
  }
  await conversation.populate("participants");
  let result = conversation.toObject();
  delete result.lastMessage;

  return success(req, res, result);
}

async function getLastMessage(req, res) {
  const conversation = await Conversation.getOneByParams({
    _id: req.params.id,
  });
  await conversation.populate({
    path: "lastMessage",
    populate: {
      path: "sender",
      model: "Users",
    },
  });
  return success(req, res, conversation.lastMessage);
}

module.exports = {
  createConversation,
  getConversationsByUser,
  getConversationDetail,
  getConversationDetailByPartnerId,
  getLastMessage,
};
