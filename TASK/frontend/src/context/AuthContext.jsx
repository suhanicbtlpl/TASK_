import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    // Validate the token is still valid and user still exists
                    const profile = await authService.getProfile();
                    // Merge fresh profile data (permissions, name etc.) with stored token
                    const stored = JSON.parse(storedUser);
                    const refreshed = { ...stored, ...profile, role: profile.role || stored.role };
                    setUser(refreshed);
                    localStorage.setItem('user', JSON.stringify(refreshed));
                } catch (err) {
                    // Token is invalid/expired/user deleted — clear it
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const data = await authService.login({ email, password });
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    // Inactivity Logout logic
    useEffect(() => {
        let timeout;
        const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes

        const resetTimer = () => {
            if (timeout) clearTimeout(timeout);
            if (user) {
                timeout = setTimeout(() => {
                    logout();
                }, INACTIVITY_LIMIT);
            }
        };

        if (user) {
            window.addEventListener('mousemove', resetTimer);
            window.addEventListener('keydown', resetTimer);
            window.addEventListener('click', resetTimer);
            window.addEventListener('scroll', resetTimer);
            resetTimer();
        }

        return () => {
            if (timeout) clearTimeout(timeout);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
            window.removeEventListener('click', resetTimer);
            window.removeEventListener('scroll', resetTimer);
        };
    }, [user]);

    const registerCompany = async (data) => {
        try {
            await authService.registerCompany(data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Registration failed'
            };
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, logout, registerCompany }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);
