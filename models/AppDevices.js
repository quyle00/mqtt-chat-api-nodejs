const BuildQuery = require('../helper/build-query-nosql');
const Constants = require('../constants');

module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            deviceToken: { type: String, required: true, unique: true, index: true },
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
        },
        { timestamps: true }
    )

    const AppDevices = mongoose.model('AppDevices', schema);

    AppDevices.getAll = async (params) => {
        const { filter, skip, limit, sort, projection, population, hasPaging } = await BuildQuery(params);
        if (hasPaging) {
            return AppDevices.paginate(filter, {
                offset: skip,
                limit: limit,
                select: projection,
                sort: sort,
                populate: population,
                customLabels: Constants.CUSTOM_LABELS_PAGINATION,
            })
        } else {
            return AppDevices.find(filter)
                .sort(sort)
                .select(projection)
                .populate(population).lean();
        }
    }

    AppDevices.createData = async (params) => {
        return await AppDevices.create(params);
    }

    AppDevices.getByID = async (id) => {
        return await AppDevices.findById(id);
    }

    AppDevices.getOneByParams = async (params) => {
        return await AppDevices.findOne(params);
    }

    AppDevices.updateData = async (id, params) => {
        return await AppDevices.findByIdAndUpdate(id, params).then((data) => {
            return AppDevices.findById(id);
        });
    }

    AppDevices.deleteOne = async (id) => {
        return await AppDevices.findByIdAndDelete(id);
    }

    AppDevices.bulkDelete = async (params) => {
        const { filter, skip, limit, sort, projection, population, hasPaging } = await BuildQuery(params);
        return AppDevices.deleteMany(filter);
    }



    return AppDevices;
}
