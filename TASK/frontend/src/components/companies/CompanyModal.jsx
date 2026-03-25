import { X, Briefcase, Mail, Phone, MapPin, Globe, User, Calendar } from 'lucide-react';
import { Button } from '../shared/UIComponents';

const CompanyModal = ({ isOpen, onClose, company }) => {
    if (!isOpen || !company) return null;

    const detailItems = [
        { icon: <Briefcase size={18} />, label: 'Company Name', value: company.companyName },
        { icon: <MapPin size={18} />, label: 'Address', value: company.address },
        { icon: <Phone size={18} />, label: 'Phone', value: company.phone },
        { icon: <Globe size={18} />, label: 'Website', value: company.website || 'N/A' },
        { icon: <User size={18} />, label: 'Owner Name', value: company.owner?.name || 'N/A' },
        { icon: <Mail size={18} />, label: 'Owner Email', value: company.owner?.email || 'N/A' },
        { icon: <Calendar size={18} />, label: 'Registered On', value: new Date(company.createdAt).toLocaleDateString() },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
            
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="px-8 py-6 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Company Details</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200/50 rounded-xl transition-colors text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 gap-6">
                        {detailItems.map((item, index) => (
                            <div key={index} className="flex items-start gap-4 group">
                                <div className="p-3 bg-slate-100 rounded-xl text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                                    <p className="text-slate-900 font-medium">{item.value}</p>
                                </div>
                            </div>
                        ))}
                        
                        {company.description && (
                            <div className="col-span-full pt-4 border-t border-slate-100">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</p>
                                <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    {company.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <Button onClick={onClose} variant="outline" className="px-8">Close</Button>
                </div>
            </div>
        </div>
    );
};

export default CompanyModal;
