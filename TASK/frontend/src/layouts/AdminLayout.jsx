import React, { useState, useEffect } from "react";
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import NotificationBell from '../components/NotificationBell';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import { projectService } from '../services/api';
import { ChevronDown, Briefcase } from 'lucide-react';

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const { selectedProjectId, selectProject } = useProject();
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoadingProjects(true);
            try {
                const res = await projectService.getProjects({ limit: 100 });
                setProjects(res.data || []);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoadingProjects(false);
            }
        };
        fetchProjects();
    }, []);

    const selectedProjectName = projects.find(p => p._id === selectedProjectId)?.projectName || 'All Projects';

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-md bg-white/80">
                    <div className="flex items-center gap-8">
                        <div className="text-sm font-medium text-slate-500">
                            Welcome back, <span className="text-slate-900 font-bold">{user?.name}</span>
                        </div>

                        {/* Project Selector */}
                        <div className="relative group">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-primary-300 transition-all cursor-pointer">
                                <Briefcase size={16} className="text-slate-400" />
                                <span className="text-sm font-semibold text-slate-700 max-w-[150px] truncate">
                                    {selectedProjectName}
                                </span>
                                <ChevronDown size={14} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
                            </div>
                            
                            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                                <div className="p-2 max-h-80 overflow-y-auto">
                                    <button
                                        onClick={() => selectProject('')}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedProjectId ? 'bg-primary-50 text-primary-700 font-bold' : 'hover:bg-slate-50 text-slate-600'}`}
                                    >
                                        All Projects
                                    </button>
                                    <div className="my-1 border-t border-slate-50"></div>
                                    {loadingProjects ? (
                                        <div className="px-3 py-2 text-xs text-slate-400 italic">Loading projects...</div>
                                    ) : projects.length === 0 ? (
                                        <div className="px-3 py-2 text-xs text-slate-400 italic">No projects found</div>
                                    ) : projects.map(project => (
                                        <button
                                            key={project._id}
                                            onClick={() => selectProject(project._id)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate transition-colors ${selectedProjectId === project._id ? 'bg-primary-50 text-primary-700 font-bold' : 'hover:bg-slate-50 text-slate-600'}`}
                                            title={project.projectName}
                                        >
                                            {project.projectName}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <NotificationBell />
                        
                        <div className="h-8 w-[1px] bg-slate-100"></div>
                        
                        <div className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-1.5 pr-4 rounded-full transition-all border border-transparent hover:border-slate-100">
                            {user?.profilePhoto ? (
                                <img src={user.profilePhoto} alt="" className="w-8 h-8 rounded-full object-cover shadow-sm bg-slate-100" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm shadow-sm">
                                    {user?.name?.charAt(0) || '?'}
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                
                <main className="p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
