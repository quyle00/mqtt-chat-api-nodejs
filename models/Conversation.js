const BuildQuery = require("../helper/build-query-nosql");
const Constants = require("../constants");
let _ = require("lodash");

module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
      lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null,
      },
    },
    { timestamps: true, versionKey: false }
  );

  const Conversation = mongoose.model("Conversation", schema);

  Conversation.getAll = async (params) => {
    const { filter, skip, limit, sort, projection, population, hasPaging } =
      await BuildQuery(params);
    if (hasPaging) {
      return Conversation.paginate(filter, {
        offset: skip,
        limit: limit,
        select: projection,
        sort: sort,
        populate: population,
        customLabels: Constants.CUSTOM_LABELS_PAGINATION,
      });
    } else {
      return Conversation.find(filter)
        .sort(sort)
        .select(projection)
        .populate(population)
        .lean();
    }
  };

  Conversation.createData = async (params) => {
    return await Conversation.create(params);
  };

  Conversation.getByID = async (params) => {
    return await Conversation.findById(params);
  };

  Conversation.getOneByParamsWithLean = async (params) => {
    return await Conversation.findById(params).lean();
  };

  Conversation.getOneByParams = async (params) => {
    return await Conversation.findOne(params);
  };

  Conversation.updateData = async (id, params) => {
    return await Conversation.findByIdAndUpdate(id, params).then((data) => {
      return Conversation.findById(id);
    });
  };

  Conversation.deleteOne = async (id) => {
    return await Conversation.findByIdAndUpdate(id).then((data) => {
      return Conversation.findById(id);
    });
  };

  return Conversation;
};
