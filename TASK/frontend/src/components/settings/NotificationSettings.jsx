import React from 'react';
import { Bell, Mail, Smartphone } from 'lucide-react';

const NotificationSettings = ({ notifications, onToggle }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in slide-in-from-right duration-500">
            <div className="flex items-center gap-3 text-slate-900 dark:text-white font-bold">
                <div className="p-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg">
                    <Bell size={20} />
                </div>
                Notifications
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Configure how you receive updates and alerts.</p>

            <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-slate-800 text-slate-400 rounded-lg shadow-sm">
                            <Mail size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">Email Notifications</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Daily reports and critical alerts</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => onToggle('email')}
                        className={`
                            relative w-11 h-6 rounded-full transition-colors outline-none
                            ${notifications.email ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-700'}
                        `}
                    >
                        <div className={`
                            absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform
                            ${notifications.email ? 'translate-x-5' : 'translate-x-0'}
                        `}></div>
                    </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-slate-800 text-slate-400 rounded-lg shadow-sm">
                            <Smartphone size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">Browser Notifications</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Real-time task updates</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => onToggle('browser')}
                        className={`
                            relative w-11 h-6 rounded-full transition-colors outline-none
                            ${notifications.browser ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-700'}
                        `}
                    >
                        <div className={`
                            absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform
                            ${notifications.browser ? 'translate-x-5' : 'translate-x-0'}
                        `}></div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationSettings;
