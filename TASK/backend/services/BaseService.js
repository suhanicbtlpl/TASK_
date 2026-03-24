class BaseService {
    constructor(model) {
        this.model = model;
    }

    async getAll(params = {}) {
        const {
            page = 1,
            limit = 10,
            search = "",
            searchFields = [],
            filter = {},
            populate = [],
            sort = { createdAt: -1 }
        } = params;

        const query = { ...filter, isDeleted: false };

        if (search && searchFields.length > 0) {
            query.$or = searchFields.map(field => ({
                [field]: { $regex: search, $options: 'i' }
            }));
        }

        const skip = (page - 1) * limit;

        let mongooseQuery = this.model.find(query)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        if (populate.length > 0) {
            populate.forEach(p => {
                mongooseQuery = mongooseQuery.populate(p);
            });
        }

        const [data, total] = await Promise.all([
            mongooseQuery,
            this.model.countDocuments(query)
        ]);

        return {
            data,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit)
        };
    }

    async getById(id, populate = []) {
        const query = this.model.findOne({ _id: id, isDeleted: false });
        if (populate.length > 0) {
            populate.forEach(p => query.populate(p));
        }
        return await query;
    }

    async create(data) {
        return await this.model.create(data);
    }

    async update(id, data) {
        return await this.model.findOneAndUpdate(
            { _id: id, isDeleted: false },
            data,
            { new: true, runValidators: true }
        );
    }

    async softDelete(id) {
        return await this.model.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
    }

    async restore(id) {
        return await this.model.findOneAndUpdate(
            { _id: id, isDeleted: true },
            { isDeleted: false },
            { new: true }
        );
    }

    async permanentDelete(id) {
        return await this.model.findOneAndDelete({ _id: id, isDeleted: true });
    }

    async getDeleted(params = {}) {
        const { page = 1, limit = 10 } = params;
        const query = { isDeleted: true };
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.model.find(query).skip(skip).limit(Number(limit)),
            this.model.countDocuments(query)
        ]);

        return {
            data,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit)
        };
    }
}

module.exports = BaseService;
