import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { user } = useAuth();

    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        try {
            const data = await notificationService.getNotifications(); // Already returns array
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Error fetching notifications', error);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll for notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        }
    }, [user, fetchNotifications]);

    const markAsRead = async (id) => {
        try {
            await notificationService.markRead(id);
            // setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setNotifications(prev => {
                const updated = prev.map(n => n._id === id ? { ...n, isRead: true } : n);
                setUnreadCount(updated.filter(n => !n.isRead).length);
                return updated;
            });
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationService.markAllRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read', error);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            fetchNotifications,
            markAsRead,
            markAllAsRead
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

// export const useNotifications = () => useContext(NotificationContext);
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within NotificationProvider");
    }
    return context;
};
