import { Eye, Trash2 } from 'lucide-react';
import { Button } from '../shared/UIComponents';

const CompanyTable = ({ companies, loading, canDelete, onView, onDelete }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (companies.length === 0) {
        return (
            <div className="text-center p-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <p className="text-slate-500 font-medium">No companies found</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Company Name</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                    {companies.map((company) => (
                        <tr key={company._id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4">
                                <span className="text-sm font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                                    {company.companyName}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    company.isActive 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {company.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onView(company)}
                                        className="h-8 w-8 p-0 border-slate-200 hover:border-primary-500 hover:text-primary-500"
                                    >
                                        <Eye size={14} />
                                    </Button>
                                    {canDelete && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onDelete(company._id)}
                                            className="h-8 w-8 p-0 border-slate-200 hover:border-red-500 hover:text-red-500"
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CompanyTable;
