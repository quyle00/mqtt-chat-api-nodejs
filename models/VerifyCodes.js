const BuildQuery = require('../helper/build-query-nosql');
const Constants = require('../constants');

module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            user : { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
            type : { type: Number, required: true },
            code : { type: Number, required: true },
            expiredAt : { type: Date, required: true },
        },
        { timestamps: true }
    )

    const VerifyCodes = mongoose.model('VerifyCodes', schema);

    VerifyCodes.getAll = async (params) => {
        const { filter, skip, limit, sort, projection, population, hasPaging } = await BuildQuery(params);
        if (hasPaging) {
            return VerifyCodes.paginate(filter, {
                offset: skip,
                limit: limit,
                select: projection,
                sort: sort,
                populate: population,
                customLabels: Constants.CUSTOM_LABELS_PAGINATION,
            })
        } else {
            return VerifyCodes.find(filter)
                .sort(sort)
                .select(projection)
                .populate(population).lean();
        }
    }

    VerifyCodes.createData = async (params) => {
        return await VerifyCodes.create(params);
    }

    VerifyCodes.getByID = async (id) => {
        return await VerifyCodes.findById(id);
    }

    VerifyCodes.getOneByParams = async (params) => {
        return await VerifyCodes.findOne(params);
    }

    VerifyCodes.updateData = async (id, params) => {
        return await VerifyCodes.findByIdAndUpdate(id, params).then((data) => {
            return VerifyCodes.findById(id);
        });
    }

    VerifyCodes.deleteOne = async (id) => {
        return await VerifyCodes.findByIdAndDelete(id);
    }



    return VerifyCodes;
}
