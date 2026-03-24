import React from 'react';
import { User, Camera, Mail, Calendar, Shield } from 'lucide-react';

const ProfileHeader = ({ user, preview, onPhotoChange }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center animate-in fade-in slide-in-from-left duration-500">
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
                    <input type="file" className="hidden" onChange={onPhotoChange} accept="image/*" />
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
    );
};

export default ProfileHeader;
