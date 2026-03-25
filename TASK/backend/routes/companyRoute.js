const express = require('express');
const router = express.Router();
const { getCompanies, getCompanyById, deleteCompany } = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, checkPermission('Company_READ'), getCompanies);

router.route('/:id')
    .get(protect, checkPermission('Company_READ'), getCompanyById)
    .delete(protect, checkPermission('Company_DELETE'), deleteCompany);

module.exports = router;
