const CompanyService = require('../services/CompanyService');
const ActivityService = require('../services/ActivityService');
const { SuccessResponse, ErrorResponse } = require('../utils/Response');

/**
 * Get all companies with search and pagination.
 */
const getCompanies = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        const result = await CompanyService.getAll({ page, limit, search });
        return SuccessResponse(res, 'Companies retrieved successfully', result);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching companies', error.message);
    }
};

/**
 * Get single company by ID.
 */
const getCompanyById = async (req, res) => {
    try {
        const company = await CompanyService.getById(req.params.id);
        if (!company) return ErrorResponse(res, 'Company not found', null, 404);
        return SuccessResponse(res, 'Company details retrieved', company);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching company details', error.message);
    }
};

/**
 * Soft delete a company.
 */
const deleteCompany = async (req, res) => {
    try {
        const company = await CompanyService.softDelete(req.params.id);
        if (!company) return ErrorResponse(res, 'Company not found', null, 404);

        await ActivityService.logActivity(
            req.user._id,
            'DELETE',
            'Company',
            `Soft deleted company: ${company.name}`,
            company._id,
            company.name
        );

        return SuccessResponse(res, 'Company soft deleted successfully');
    } catch (error) {
        return ErrorResponse(res, 'Error deleting company', error.message, 400);
    }
};

module.exports = {
    getCompanies,
    getCompanyById,
    deleteCompany
};
