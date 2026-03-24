import React from 'react';

const RecycleBinTabs = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none animate-in fade-in slide-in-from-left duration-500">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap text-sm font-medium
                        ${activeTab === tab.id 
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' 
                            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'}
                    `}
                >
                    <tab.icon size={18} />
                    {tab.name}
                </button>
            ))}
        </div>
    );
};

export default RecycleBinTabs;
