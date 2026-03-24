import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authService } from '../services/api';
import { 
    Moon, 
    Sun, 
    Bell, 
    Mail, 
    Globe, 
    Smartphone,
    Save,
    RotateCcw
} from 'lucide-react';

const Settings = () => {
    const { user, setUser } = useAuth();
    const { theme, setTheme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState(user?.settings || {
        theme: theme,
        notifications: {
            email: true,
            browser: true
        }
    });

    const handleSave = async () => {
        setLoading(true);
        try {
            await authService.updateSettings(settings);
            alert('Settings saved successfully');
            setUser(prev => ({ ...prev, settings }));
        } catch (error) {
            alert(error.response?.data?.message || error.message || 'Error saving settings');
        } finally {
            setLoading(false);
        }
    };

    // Instantly apply theme when toggled (before save)
    const handleThemeChange = (newTheme) => {
        setSettings(prev => ({ ...prev, theme: newTheme }));
        setTheme(newTheme); // Immediately applies dark class to <html>
    };

    const toggleNotification = (type) => {
        setSettings({
            ...settings,
            notifications: {
                ...settings.notifications,
                [type]: !settings.notifications[type]
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400">Customize your application experience</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setSettings(user?.settings)}
                        className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-medium"
                    >
                        <RotateCcw size={18} />
                        Reset
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-semibold shadow-md disabled:opacity-50"
                    >
                        {loading ? <Save className="animate-pulse" size={18} /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Theme Selection */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
                    <div className="flex items-center gap-3 text-slate-900 dark:text-white font-bold">
                        <div className="p-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg">
                            {settings.theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                        </div>
                        Appearance
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Choose how the interface looks on your device.</p>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <button 
                            onClick={() => handleThemeChange('light')}
                            className={`
                                p-4 rounded-xl border-2 transition-all text-left space-y-3
                                ${settings.theme === 'light' ? 'border-primary-500 bg-primary-50/30' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-600'}
                            `}
                        >
                            <div className="w-full aspect-video bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden flex flex-col p-1.5 gap-1">
                                <div className="h-1.5 w-1/2 bg-slate-200 rounded-full"></div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full"></div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full"></div>
                            </div>
                            <span className={`text-sm font-semibold ${settings.theme === 'light' ? 'text-primary-700 dark:text-primary-400' : 'text-slate-700 dark:text-slate-400'}`}>Light Mode</span>
                        </button>
                        
                        <button 
                            onClick={() => handleThemeChange('dark')}
                            className={`
                                p-4 rounded-xl border-2 transition-all text-left space-y-3
                                ${settings.theme === 'dark' ? 'border-primary-500 bg-primary-900/20' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-600'}
                            `}
                        >
                            <div className="w-full aspect-video bg-slate-900 rounded-md border border-slate-700 shadow-sm overflow-hidden flex flex-col p-1.5 gap-1">
                                <div className="h-1.5 w-1/2 bg-slate-700 rounded-full"></div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full"></div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full"></div>
                            </div>
                            <span className={`text-sm font-semibold ${settings.theme === 'dark' ? 'text-white' : 'text-slate-700 dark:text-slate-400'}`}>Dark Mode</span>
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
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
                                onClick={() => toggleNotification('email')}
                                className={`
                                    relative w-11 h-6 rounded-full transition-colors outline-none
                                    ${settings.notifications.email ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-700'}
                                `}
                            >
                                <div className={`
                                    absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform
                                    ${settings.notifications.email ? 'translate-x-5' : 'translate-x-0'}
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
                                onClick={() => toggleNotification('browser')}
                                className={`
                                    relative w-11 h-6 rounded-full transition-colors outline-none
                                    ${settings.notifications.browser ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-700'}
                                `}
                            >
                                <div className={`
                                    absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform
                                    ${settings.notifications.browser ? 'translate-x-5' : 'translate-x-0'}
                                `}></div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Localization (Placeholder for Phase 5) */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4 md:col-span-2">
                    <div className="flex items-center gap-3 text-slate-900 dark:text-white font-bold">
                        <div className="p-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg">
                            <Globe size={20} />
                        </div>
                        System & Regional
                    </div>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 space-y-1.5">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Language</label>
                            <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all text-slate-900 dark:text-white">
                                <option>English (United States)</option>
                                <option>Spanish</option>
                                <option>French</option>
                                <option>Hindi</option>
                            </select>
                        </div>
                        <div className="flex-1 space-y-1.5">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Timezone</label>
                            <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all text-slate-900 dark:text-white">
                                <option>(GMT-05:00) Eastern Time</option>
                                <option>(GMT+05:30) India Standard Time</option>
                                <option>(GMT+00:00) UTC</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
