import React from "react";
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import NotificationBell from '../components/NotificationBell';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { logout, user } = useAuth();

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-md bg-white/80">
                    <div className="text-sm font-medium text-slate-500">
                        Welcome back, <span className="text-slate-900 font-bold">{user?.name}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <NotificationBell />
                        
                        <div className="h-8 w-[1px] bg-slate-100"></div>
                        
                        <div className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-1.5 pr-4 rounded-full transition-all border border-transparent hover:border-slate-100">
                            {user?.profilePhoto ? (
                                <img src={user.profilePhoto} alt="" className="w-8 h-8 rounded-full object-cover shadow-sm bg-slate-100" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm shadow-sm">
                                    {user?.name?.charAt(0) || '?'}
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                
                <main className="p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
