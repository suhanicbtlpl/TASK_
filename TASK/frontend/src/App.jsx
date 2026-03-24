import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Staff from './pages/Staff';
import Roles from './pages/Roles';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Permissions from './pages/Permissions';
import Documents from './pages/Documents';
import Issues from './pages/Issues';
import RecycleBin from './pages/RecycleBin';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import AdminLayout from './layouts/AdminLayout';



const ProtectedRoute = ({ children, requiredPermission }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    if (requiredPermission && !user?.role?.permissions?.includes(requiredPermission)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />


                <Route path="/" element={
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="staff" element={
                        <ProtectedRoute requiredPermission="Staff_READ">
                            <Staff />
                        </ProtectedRoute>
                    } />
                    <Route path="roles" element={
                        <ProtectedRoute requiredPermission="Role_READ">
                            <Roles />
                        </ProtectedRoute>
                    } />
                    <Route path="projects" element={
                        <ProtectedRoute requiredPermission="Project_READ">
                            <Projects />
                        </ProtectedRoute>
                    } />
                    <Route path="tasks" element={
                        <ProtectedRoute requiredPermission="Task_READ">
                            <Tasks />
                        </ProtectedRoute>
                    } />
                    <Route path="permissions" element={
                        <ProtectedRoute requiredPermission="Permission_READ">
                            <Permissions />
                        </ProtectedRoute>
                    } />
                    <Route path="documents" element={
                        <ProtectedRoute requiredPermission="Document_READ">
                            <Documents />
                        </ProtectedRoute>
                    } />
                    <Route path="issues" element={
                        <ProtectedRoute requiredPermission="Issue_READ">
                            <Issues />
                        </ProtectedRoute>
                    } />
                    <Route path="recycle-bin" element={
                        <ProtectedRoute requiredPermission="Role_READ">
                            <RecycleBin />
                        </ProtectedRoute>
                    } />
                    <Route path="profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />
                    <Route path="settings" element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    } />
                </Route>




                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
