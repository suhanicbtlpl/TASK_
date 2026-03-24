import React, { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authService } from '../services/api';

import AppearanceSettings from '../components/settings/AppearanceSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import RegionalSettings from '../components/settings/RegionalSettings';

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
            alert(error.response?.data?.message || 'Error saving settings');
        } finally {
            setLoading(false);
        }
    };

    const handleThemeChange = (newTheme) => {
        setSettings(prev => ({ ...prev, theme: newTheme }));
        setTheme(newTheme);
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

    const handleReset = () => {
        if (user?.settings) {
            setSettings(user.settings);
            setTheme(user.settings.theme);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">System Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400">Tailor the application to your preferences</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-medium text-sm"
                    >
                        <RotateCcw size={16} />
                        Reset
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-semibold shadow-md disabled:opacity-50 text-sm"
                    >
                        <Save size={16} className={loading ? 'animate-pulse' : ''} />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AppearanceSettings 
                    theme={settings.theme} 
                    onThemeChange={handleThemeChange} 
                />

                <NotificationSettings 
                    notifications={settings.notifications} 
                    onToggle={toggleNotification} 
                />

                <RegionalSettings />
            </div>
        </div>
    );
};

export default Settings;
