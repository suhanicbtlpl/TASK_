import React from 'react';
import { Sun, Moon } from 'lucide-react';

const AppearanceSettings = ({ theme, onThemeChange }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in slide-in-from-left duration-500">
            <div className="flex items-center gap-3 text-slate-900 dark:text-white font-bold">
                <div className="p-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg">
                    {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                </div>
                Appearance
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Choose how the interface looks on your device.</p>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
                <button 
                    onClick={() => onThemeChange('light')}
                    className={`
                        p-4 rounded-xl border-2 transition-all text-left space-y-3
                        ${theme === 'light' ? 'border-primary-500 bg-primary-50/30' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-600'}
                    `}
                >
                    <div className="w-full aspect-video bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden flex flex-col p-1.5 gap-1">
                        <div className="h-1.5 w-1/2 bg-slate-200 rounded-full"></div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full"></div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full"></div>
                    </div>
                    <span className={`text-sm font-semibold ${theme === 'light' ? 'text-primary-700 dark:text-primary-400' : 'text-slate-700 dark:text-slate-400'}`}>Light Mode</span>
                </button>
                
                <button 
                    onClick={() => onThemeChange('dark')}
                    className={`
                        p-4 rounded-xl border-2 transition-all text-left space-y-3
                        ${theme === 'dark' ? 'border-primary-500 bg-primary-900/20' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-600'}
                    `}
                >
                    <div className="w-full aspect-video bg-slate-900 rounded-md border border-slate-700 shadow-sm overflow-hidden flex flex-col p-1.5 gap-1">
                        <div className="h-1.5 w-1/2 bg-slate-700 rounded-full"></div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full"></div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full"></div>
                    </div>
                    <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-700 dark:text-slate-400'}`}>Dark Mode</span>
                </button>
            </div>
        </div>
    );
};

export default AppearanceSettings;
