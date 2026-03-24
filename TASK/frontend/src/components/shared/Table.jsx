import React from 'react';

export const Table = ({ columns, data, loading, actions }) => {
    const safeData = data || [];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                        {columns.map((col, idx) => (
                            <th key={idx} className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {col.header}
                            </th>
                        ))}
                        {actions && (
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {safeData.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-8 text-center text-slate-500">
                                No records found
                            </td>
                        </tr>
                    ) : (
                        safeData.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-slate-50/50 transition-colors group">
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} className="px-6 py-4 text-sm text-slate-600">
                                        {col.render ? col.render(row) : (row[col.accessor] || row[col.key])}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-6 py-4 text-right whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                        {actions(row)}
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
