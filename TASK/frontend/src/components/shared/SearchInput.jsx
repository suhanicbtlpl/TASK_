import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchInput = ({ onSearch, placeholder = "Search..." }) => {
    const [value, setValue] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(value);
        }, 500);

        return () => clearTimeout(timer);
    }, [value]);

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const handleClear = () => {
        setValue("");
        onSearch("");
    };

    return (
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-2 border rounded-lg"
            />

            {value && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 top-2.5"
                >
                    <X className="h-4 w-4 text-gray-400" />
                </button>
            )}
        </div>
    );
};

export default SearchInput;