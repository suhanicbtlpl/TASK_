import React from 'react';
import { RefreshCcw, Trash2, Info, AlertCircle } from 'lucide-react';

const RecycleBinTable = ({ items, loading, activeTab, onRestore, onPermanentDelete, getDisplayName, getDisplayDetail }) => {
    if (loading) {
        return (
            <div className="p-20 flex flex-col items-center justify-center gap-4 bg-white rounded-xl border border-slate-200">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 animate-pulse">Loading deleted items...</p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="p-20 flex flex-col items-center justify-center text-center bg-white rounded-xl border border-slate-200">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Trash2 className="text-slate-400" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">No deleted items</h3>
                <p className="text-slate-500 max-w-xs mx-auto">The recycle bin is empty for the {activeTab} module.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 text-slate-600">
                <AlertCircle size={18} />
                <span className="text-sm font-medium">Deleted items will be preserved unless permanently removed.</span>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                        <tr>
                            <th className="px-6 py-4">Name / Title</th>
                            <th className="px-6 py-4">Detail</th>
                            <th className="px-6 py-4">Deleted At</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {items.map((item) => (
                            <tr key={item._id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{getDisplayName(item)}</div>
                                    <div className="text-[10px] text-slate-400 font-mono tracking-tighter">ID: {item._id}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-slate-600">{getDisplayDetail(item)}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {new Date(item.updatedAt).toLocaleDateString(undefined, { 
                                        year: 'numeric', 
                                        month: 'short', 
                                        day: 'numeric' 
                                    })}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onRestore(item._id)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors text-xs font-semibold"
                                        >
                                            <RefreshCcw size={14} />
                                            Restore
                                        </button>
                                        <button
                                            onClick={() => onPermanentDelete(item._id)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors text-xs font-semibold"
                                        >
                                            <Trash2 size={14} />
                                            Erase
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecycleBinTable;
