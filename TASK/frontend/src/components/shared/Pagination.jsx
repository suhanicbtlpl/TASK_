import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
    currentPage = 1, 
    totalPages = 1, 
    totalRecords = 0, 
    limit = 10, 
    onPageChange, 
    onLimitChange 
}) => {
    const safeCurrent = currentPage || 1;
    const safeTotal = totalPages || 1;
    const safeRecords = totalRecords || 0;
    const safeLimit = limit || 10;

    const pageNumbers = [];
    for (let i = 1; i <= safeTotal; i++) {
        pageNumbers.push(i);
    }

    if (safeTotal <= 1 && safeRecords <= 5) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2">
            <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                    <span>Rows per page:</span>
                    <select
                        value={safeLimit}
                        onChange={(e) => onLimitChange(Number(e.target.value))}
                        className="bg-white border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {[5, 10, 15, 20].map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </div>
                <span>
                    Showing <span className="font-medium text-slate-900">{Math.min((safeCurrent - 1) * safeLimit + 1, safeRecords)}</span> to{' '}
                    <span className="font-medium text-slate-900">{Math.min(safeCurrent * safeLimit, safeRecords)}</span> of{' '}
                    <span className="font-medium text-slate-900">{safeRecords}</span> entries
                </span>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(safeCurrent - 1)}
                    disabled={safeCurrent === 1}
                    className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                
                <div className="flex items-center gap-1">
                    {pageNumbers.map((number) => (
                        <button
                            key={number}
                            onClick={() => onPageChange(number)}
                            className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors ${
                                safeCurrent === number
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            {number}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(safeCurrent + 1)}
                    disabled={safeCurrent === safeTotal}
                    className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
