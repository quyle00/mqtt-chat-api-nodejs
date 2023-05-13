const BuildQuery = require('../helper/build-query-nosql');
const Constants = require('../constants');

module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
            title: { type: String, required: true },
            description: { type: String, required: true },
            information: Object,
            type: { type: Number, required: true,default: 1 },
            status: { type: Boolean, required: true, default: false },
        },
        { timestamps: true }
    )

    const UserNotifications = mongoose.model('UserNotifications', schema);

    UserNotifications.getAll = async (params) => {
        const { filter, skip, limit, sort, projection, population, hasPaging } = await BuildQuery(params);
        if (hasPaging) {
            return UserNotifications.paginate(filter, {
                offset: skip,
                limit: limit,
                select: projection,
                sort: sort,
                populate: population,
                customLabels: Constants.CUSTOM_LABELS_PAGINATION,
            })
        } else {
            return UserNotifications.find(filter)
                .sort(sort)
                .select(projection)
                .populate(population).lean();
        }
    }

    UserNotifications.createData = async (params) => {
        return await UserNotifications.create(params);
    }

    UserNotifications.getByID = async (id) => {
        return await UserNotifications.findById(id);
    }

    UserNotifications.getOneByParams = async (params) => {
        return await UserNotifications.findOne(params);
    }

    UserNotifications.updateData = async (id, params) => {
        return await UserNotifications.findByIdAndUpdate(id, params).then((data) => {
            return UserNotifications.findById(id);
        });
    }

    UserNotifications.deleteOne = async (id) => {
        return await UserNotifications.findByIdAndDelete(id);
    }

    UserNotifications.bulkDelete = async (params) => {
        const {filter, skip, limit, sort, projection, population, hasPaging} = await BuildQuery(params);
        return UserNotifications.deleteMany(filter);
    }



    return UserNotifications;
}
