const BuildQuery = require("../helper/build-query-nosql");
const Constants = require("../constants");

module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
      },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
      reply: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
      content: { type: String },
      medias: [{ type: Object }],
      type: { type: Number, required: true },
      sendTime: { type: Number, required: true },
      state: { type: Number, required: true },
      edited: { type: Boolean, default: false },
    },
    { timestamps: true }
  );

  const Message = mongoose.model("Message", schema);

  Message.getAll = async (params) => {
    const { filter, skip, limit, sort, projection, population, hasPaging } =
      await BuildQuery(params);
    if (hasPaging) {
      return Message.paginate(filter, {
        offset: skip,
        limit: limit,
        select: projection,
        sort: sort,
        populate: population,
        customLabels: Constants.CUSTOM_LABELS_PAGINATION,
      });
    } else {
      return Message.find(filter)
        .sort(sort)
        .select(projection)
        .populate(population)
        .lean();
    }
  };

  Message.createData = async (params) => {
    return await Message.create(params);
  };

  Message.getByID = async (id) => {
    return await Message.findById(id);
  };

  Message.getOneByParams = async (params) => {
    return await Message.findOne(params);
  };

  Message.updateData = async (id, params) => {
    return await Message.findByIdAndUpdate(id, params).then((data) => {
      return Message.findById(id);
    });
  };

  Message.deleteOne = async (id) => {
    return await Message.findByIdAndDelete(id);
  };

  return Message;
};
