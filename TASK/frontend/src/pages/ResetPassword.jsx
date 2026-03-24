import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { Lock, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '../components/shared/UIComponents';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setMessage({ type: 'error', text: 'Passwords do not match' });
        }
        if (password.length < 6) {
            return setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
        }

        setLoading(true);
        try {
            await authService.resetPassword(token, password);
            setMessage({ type: 'success', text: 'Password reset successful! Redirecting...' });
            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to reset password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Reset Password</h1>
                    <p className="text-slate-400 mt-2">Create a new strong password for your account</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl overflow-hidden relative group">
                    <form onSubmit={handleSubmit} className="space-y-6 relative">
                        <div className="space-y-4">
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" size={18} />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all placeholder:text-slate-500"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" size={18} />
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all placeholder:text-slate-500"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading || !token}
                            className="w-full py-3.5 text-base shadow-xl shadow-primary-500/30"
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                            {!loading && <RefreshCw size={18} className="ml-2" />}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <Link to="/login" className="inline-flex items-center text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors">
                            <ArrowLeft size={16} className="mr-2" />
                            Back to Sign In
                        </Link>
                    </div>

                    {message.text && (
                        <div className={`mt-4 p-3 rounded-lg text-sm font-medium text-center ${
                            message.type === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                            {message.text}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
