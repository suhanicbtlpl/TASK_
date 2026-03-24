import { useState, useRef, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                    <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <h3 className="font-bold text-slate-800">Notifications</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={markAllAsRead}
                                className="text-xs text-primary-600 font-semibold hover:underline"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div 
                                    key={notification._id}
                                    className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer relative ${!notification.isRead ? 'bg-primary-50/30' : ''}`}
                                    onClick={() => !notification.isRead && markAsRead(notification._id)}
                                >
                                    {!notification.isRead && (
                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                                    )}
                                    <div className="ml-2">
                                        <p className={`text-sm ${!notification.isRead ? 'font-bold' : 'font-medium'} text-slate-800`}>
                                            {notification.title}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                            {notification.message}
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-2">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center">
                                <Bell className="mx-auto text-slate-200 mb-2" size={32} />
                                <p className="text-sm text-slate-400">All caught up!</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="p-3 bg-slate-50 text-center">
                        <button className="text-xs text-slate-500 font-medium hover:text-slate-700">
                            View all notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
