import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { Button } from '../components/shared/UIComponents';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        try {
            await authService.forgotPassword(email);
            setSent(true);
        } catch (error) {
            setErrorMsg(error.message || 'Failed to send reset link');
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
                    <h1 className="text-3xl font-bold text-white tracking-tight">Forgot Password?</h1>
                    <p className="text-slate-400 mt-2">Enter your email to receive a reset token</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl overflow-hidden relative group">
                    {!sent ? (
                        <form onSubmit={handleSubmit} className="space-y-6 relative">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" size={18} />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all placeholder:text-slate-500"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 text-base shadow-xl shadow-primary-500/30"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                                    {!loading && <Send size={18} className="ml-2" />}
                            </Button>
                            {errorMsg && (
                                <div className="mt-3 p-3 rounded-lg bg-red-500/20 text-red-300 text-sm text-center">
                                    {errorMsg}
                                </div>
                            )}
                        </form>
                    ) : (
                        <div className="text-center space-y-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-2">
                                <Send className="text-emerald-400" size={32} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Check Your Email</h3>
                                <p className="text-slate-400 text-sm">
                                    We've sent a password reset token to <b>{email}</b>. 
                                    (For testing, check the backend response/console for the token)
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <Link to="/login" className="inline-flex items-center text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors">
                            <ArrowLeft size={16} className="mr-2" />
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
