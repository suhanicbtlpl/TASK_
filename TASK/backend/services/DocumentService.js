const BaseService = require('./BaseService');
const Document = require('../models/Document');

class DocumentService extends BaseService {
    constructor() {
        super(Document);
    }

    async getAll(params) {
        return super.getAll({
            ...params,
            searchFields: ['title', 'fileName', 'category'],
            populate: [
                { path: 'uploadedBy', select: 'name email' },
                { path: 'projectId', select: 'projectName' }
            ]
        });
    }

}

module.exports = new DocumentService();
