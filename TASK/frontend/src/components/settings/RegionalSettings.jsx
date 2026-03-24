import React from 'react';
import { Globe } from 'lucide-react';

const RegionalSettings = () => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4 md:col-span-2 animate-in fade-in slide-in-from-bottom duration-700">
            <div className="flex items-center gap-3 text-slate-900 dark:text-white font-bold">
                <div className="p-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg">
                    <Globe size={20} />
                </div>
                System & Regional
            </div>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Language</label>
                    <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all text-slate-900 dark:text-white text-sm">
                        <option>English (United States)</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>Hindi</option>
                    </select>
                </div>
                <div className="flex-1 space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Timezone</label>
                    <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all text-slate-900 dark:text-white text-sm">
                        <option>(GMT-05:00) Eastern Time</option>
                        <option>(GMT+05:30) India Standard Time</option>
                        <option>(GMT+00:00) UTC</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default RegionalSettings;
