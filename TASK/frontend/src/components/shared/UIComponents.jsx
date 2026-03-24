import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { X } from 'lucide-react';

/**
 * Utility to merge tailwind classes
 */
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Card Component
 */
export const Card = ({ children, title, className, action, glass = false }) => {
    return (
        <div className={cn(
            "rounded-2xl border transition-all duration-300",
            glass ? "glass-panel" : "card",
            className
        )}>
            {(title || action) && (
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    {title && <h3 className="font-bold text-slate-800 tracking-tight">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className={cn(title || action ? "p-6" : "")}>
                {children}
            </div>
        </div>
    );
};

/**
 * Button Component
 */
export const Button = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    ...props
}) => {
    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/20 active:scale-95',
        secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95',
        danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20 active:scale-95',
        ghost: 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800',
        outline: 'bg-transparent border border-slate-200 text-slate-600 hover:bg-slate-50'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs font-bold',
        md: 'px-5 py-2.5 text-sm font-bold',
        lg: 'px-8 py-3.5 text-base font-bold'
    };

    return (
        <button
            disabled={disabled || loading}
            className={cn(
                "inline-flex items-center justify-center rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed gap-2",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {loading && (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {children}
        </button>
    );
};

/**
 * Input Component
 */
export const Input = ({ label, error, className, ...props }) => {
    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label className="text-sm font-semibold text-slate-700 ml-1">
                    {label}
                </label>
            )}
            <input
                className={cn(
                    "w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all",
                    "focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500",
                    "placeholder:text-slate-400 text-slate-700 text-sm",
                    error ? "border-rose-500 focus:ring-rose-500/10 focus:border-rose-500" : "",
                    className
                )}
                {...props}
            />
            {error && (
                <p className="text-xs text-rose-500 font-medium mt-1 ml-1">{error}</p>
            )}
        </div>
    );
};

/**
 * Modal Component
 */
export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 flex items-center justify-center p-4 z-[70] pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className={cn(
                                "w-full bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto",
                                maxWidth
                            )}
                        >
                            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 bg-slate-50/50">
                                <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-slate-200/50 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 max-h-[70vh] overflow-y-auto">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
