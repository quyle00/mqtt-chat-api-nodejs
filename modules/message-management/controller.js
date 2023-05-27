const { success, error } = require("../../helper/response");
const { Message, Conversation } = require("../../models");
const Validate = require("../../helper/get-errors-messages-validate");

async function getMessageByConversationId(req, res) {
  // await Message.deleteMany();
  // await Conversation.deleteMany();
  let query = {
    populate: "sender,reply.sender",
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
  if (req.body.message) {
    req.body = JSON.parse(req.body.message);
  }
  if (req.files) {
    // console.log(req.files);
    req.body.images = [];
    req.files.map((item) => {
      let fullUrl = "http://172.17.12.122:3000/images" + "/" + item.filename;
      req.body.images.push(fullUrl);
    });
  }
  req.body.conversation = req.params.id;
  req.body.sender = req.user.id;
  let rules = {
    // content: ["required"],
    sendTime: ["required"],
    state: ["required"],
    type: ["required"],
  };
  let validate = await Validate(req.body, rules);
  if (validate) {
    return error(req, res, validate);
  }
  delete req.body._id;
  const result = await Message.createData(req.body);
  await result.populate("sender");
  if (result.reply) {
    await result.populate({
      path: "reply",
      populate: {
        path: "sender",
        model: "Users",
      },
    });
  }
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
