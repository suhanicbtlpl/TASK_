import { useState, useEffect, useCallback } from 'react';
import { companyService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/shared/UIComponents';
import SearchInput from '../components/shared/SearchInput';
import Pagination from '../components/shared/Pagination';
import CompanyTable from '../components/companies/CompanyTable';
import CompanyModal from '../components/companies/CompanyModal';

const Companies = () => {
    const { user } = useAuth();
    // Assuming permissions are stored as strings like 'Company_READ', 'Company_DELETE'
    const canDelete = user?.role?.permissions?.includes('Company_DELETE');

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const fetchCompanies = useCallback(async () => {
        setLoading(true);
        try {
            const res = await companyService.getCompanies({ page, limit, search });
            setCompanies(res.data || []);
            setTotalPages(res.pages || 1);
            setTotalRecords(res.total || 0);
        } catch (error) {
            console.error('Error fetching companies:', error);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search]);

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    const handleSearch = (searchValue) => {
        setSearch(searchValue);
        setPage(1);
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1);
    };

    const handleViewDetails = (company) => {
        setSelectedCompany(company);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this company?')) {
            try {
                await companyService.deleteCompany(id);
                fetchCompanies();
            } catch (error) {
                alert(error.response?.data?.message || 'Delete failed');
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Company Management</h1>
                <p className="text-slate-500">View and manage registered companies</p>
            </div>

            <Card className="p-4 border-slate-200 shadow-sm overflow-hidden">
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="w-full max-w-md">
                        <SearchInput onSearch={handleSearch} placeholder="Search companies..." />
                    </div>
                </div>

                <CompanyTable
                    companies={companies}
                    loading={loading}
                    canDelete={canDelete}
                    onView={handleViewDetails}
                    onDelete={handleDelete}
                />

                <div className="mt-6">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        totalRecords={totalRecords}
                        limit={limit}
                        onPageChange={setPage}
                        onLimitChange={handleLimitChange}
                    />
                </div>
            </Card>

            <CompanyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                company={selectedCompany}
            />
        </div>
    );
};

export default Companies;
