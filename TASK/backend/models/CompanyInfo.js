const mongoose = require('mongoose');

const companyInfoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    website: { type: String },
    description: { type: String },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }
}, { timestamps: true });

module.exports = mongoose.model('CompanyInfo', companyInfoSchema);