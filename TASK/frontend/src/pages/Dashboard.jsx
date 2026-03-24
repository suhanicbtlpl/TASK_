import { useState, useEffect } from 'react';
import { Card } from '../components/shared/UIComponents';
import {
    Users,
    Briefcase,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react';
import { staffService, projectService, taskService, activityService } from '../services/api';

import StatCard from '../components/dashboard/StatCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalStaff: 0,
        totalProjects: 0,
        totalTasks: 0,
        pendingTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0
    });
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [staffRes, projectsRes, tasksRes, activitiesRes] = await Promise.all([
                    staffService.getStaff(),
                    projectService.getProjects(),
                    taskService.getTasks(),
                    activityService.getRecentActivities(6)
                ]);

                const staff = staffRes.data || [];
                const projects = projectsRes.data || [];
                const tasks = tasksRes.data || [];
                
                setActivities(Array.isArray(activitiesRes) ? activitiesRes : []);

                setStats({
                    totalStaff: staff.length,
                    totalProjects: projects.length,
                    totalTasks: tasks.length,
                    pendingTasks: tasks.filter(t => t.status === 'Pending').length,
                    completedTasks: tasks.filter(t => t.status === 'Completed').length,
                    inProgressTasks: tasks.filter(t => t.status === 'InProgress').length
                });

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = [
        { label: 'Total Staff', value: stats.totalStaff, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Projects', value: stats.totalProjects, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Total Tasks', value: stats.totalTasks, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Pending Tasks', value: stats.pendingTasks, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
        { label: 'Completed Tasks', value: stats.completedTasks, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    if (loading) {
        return (
            <div className="animate-pulse space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {[...Array(5)].map((_, i) => <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>)}
                </div>
                <div className="h-96 bg-slate-200 rounded-xl"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Overview</h1>
                <p className="text-slate-500">Insights and management at a glance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {statCards.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <Card 
                title="Recent Activity" 
                action={<button className="text-primary-600 text-sm font-semibold hover:underline">View All</button>}
            >
                <ActivityFeed activities={activities} />
            </Card>
        </div>
    );
};

export default Dashboard;
