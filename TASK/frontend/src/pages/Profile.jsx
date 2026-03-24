import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
// import { toast } from 'react-hot-toast'; // Removed as per user request to avoid external libraries
import { User, Mail, Phone, Shield, Camera, Lock, Calendar } from 'lucide-react';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        mobileNumber: user?.mobileNumber || '',
    });
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [preview, setPreview] = useState(user?.profilePhoto ? `http://localhost:5000${user.profilePhoto}` : null);
    const [file, setFile] = useState(null);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        data.append('name', formData.name);
        data.append('mobileNumber', formData.mobileNumber);
        if (file) {
            data.append('profilePhoto', file);
        }

        try {
            const res = await authService.updateProfile(data);
            alert('Profile updated successfully');
            // Update auth context with new user data
            setUser(prev => ({ ...prev, ...res }));
            
            // Re-fetch profile to ensure all state is synced
            const profile = await authService.getProfile();
            localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), name: profile.name, profilePhoto: profile.profilePhoto }));
        } catch (error) {
            alert(error.response?.data?.message || error.message || 'Action failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return alert('Passwords do not match');
        }
        setLoading(true);
        try {
            await authService.changePassword({
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            });
            alert('Password changed successfully');
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">User Profile</h1>
                    <p className="text-slate-500">Manage your personal information and security</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Photo Sidebar */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-md">
                                {preview ? (
                                    <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <User size={64} />
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full cursor-pointer shadow-lg hover:bg-primary-700 transition-colors">
                                <Camera size={16} />
                                <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
                            </label>
                        </div>
                        <h2 className="mt-4 text-lg font-bold text-slate-900">{user?.name}</h2>
                        <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold uppercase mt-1">
                            {user?.role?.roleName}
                        </span>
                        <div className="w-full mt-6 pt-6 border-t border-slate-100 space-y-3">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Mail size={14} />
                                <span className="truncate">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Calendar size={14} />
                                <span className="truncate">Last login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Shield size={14} />
                                <span className="flex items-center gap-2">
                                    Status: 
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                        user?.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 
                                        'bg-red-100 text-red-600'
                                    }`}>
                                        {user?.status || 'Active'}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Profile Forms */}
                <div className="md:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900">Basic Information</h3>
                        </div>
                        <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            value={formData.mobileNumber}
                                            onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Email Address (Read-only)</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 transition-all shadow-md active:scale-95"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Security */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900">Security / Password</h3>
                        </div>
                        <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Current Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                    <input
                                        type="password"
                                        value={passwords.oldPassword}
                                        onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                        <input
                                            type="password"
                                            value={passwords.newPassword}
                                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                        <input
                                            type="password"
                                            value={passwords.confirmPassword}
                                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-900 disabled:opacity-50 transition-all shadow-md active:scale-95"
                                >
                                    {loading ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
