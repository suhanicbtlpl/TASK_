import React, { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';

const SearchInput = ({ placeholder = "Search...", onSearch, initialValue = "" }) => {
    const [value, setValue] = useState(initialValue);

    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    const debouncedSearch = useCallback(
        debounce((searchValue) => {
            onSearch(searchValue);
        }, 500),
        [onSearch]
    );

    const handleChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        debouncedSearch(newValue);
    };

    const handleClear = () => {
        setValue("");
        onSearch("");
    };

    return (
        <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-10 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
            />
            {value && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-slate-600 transition-colors"
                >
                    <X className="h-4 w-4 text-slate-400" />
                </button>
            )}
        </div>
    );
};

export default SearchInput;
