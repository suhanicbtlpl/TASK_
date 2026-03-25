import { useState } from 'react';
import { Button } from '../components/shared/UIComponents';
import { Briefcase, Mail, Lock, User, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterCompanyForm = ({ onCancel }) => {
    const [formData, setFormData] = useState({
        companyName: '',
        address: '',
        phone: '',
        ownerName: '',
        ownerEmail: '',
        ownerPassword: '',
        ownerMobile: ''
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { registerCompany } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        const result = await registerCompany(formData);
        if (result.success) {
            setMessage('Company registered successfully! You can now login.');
            setFormData({
                companyName: '',
                address: '',
                phone: '',
                ownerName: '',
                ownerEmail: '',
                ownerPassword: '',
                ownerMobile: ''
            });
            setTimeout(() => onCancel(), 2000);
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl shadow-xl shadow-primary-500/20 mb-4">
                        <Briefcase className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Register Your Company</h1>
                    <p className="text-slate-400 mt-2">Get started with our management system</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative group">
                    <button 
                        onClick={onCancel}
                        className="absolute left-6 top-6 text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
                    >
                        <ArrowLeft size={16} /> Back to Login
                    </button>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm font-medium">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200 text-sm font-medium">
                                {message}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Company Details */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wider">Company Information</h3>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        name="companyName"
                                        placeholder="Company Name"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary-500 transition-all"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Company Address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary-500 transition-all"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        name="phone"
                                        placeholder="Company Phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary-500 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Owner Details */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wider">Owner Information</h3>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        name="ownerName"
                                        placeholder="Owner Full Name"
                                        value={formData.ownerName}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary-500 transition-all"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="email"
                                        name="ownerEmail"
                                        placeholder="Owner Email"
                                        value={formData.ownerEmail}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary-500 transition-all"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="password"
                                        name="ownerPassword"
                                        placeholder="Owner Password"
                                        value={formData.ownerPassword}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary-500 transition-all"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        name="ownerMobile"
                                        placeholder="Owner Mobile"
                                        value={formData.ownerMobile}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary-500 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 text-lg shadow-xl shadow-primary-500/30"
                        >
                            {loading ? 'Registering...' : 'Register Company'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterCompanyForm;