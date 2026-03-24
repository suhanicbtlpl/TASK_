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
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

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
    const [workloadData, setWorkloadData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
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

                // Calculate stats
                setStats({
                    totalStaff: staff.length,
                    totalProjects: projects.length,
                    totalTasks: tasks.length,
                    pendingTasks: tasks.filter(t => t.status === 'Pending').length,
                    completedTasks: tasks.filter(t => t.status === 'Completed').length,
                    inProgressTasks: tasks.filter(t => t.status === 'InProgress').length
                });

                // Calculate workload (tasks per staff)
                const workload = staff.map(s => {
                    const count = tasks.filter(t => t.assignedStaff?.some(as => (typeof as === 'string' ? as : as._id) === s._id)).length;
                    return { name: s.name, value: count };
                }).filter(w => w.value > 0);
                setWorkloadData(workload);

            } catch (error) {
                console.error('Error fetching dashboard stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Staff', value: stats.totalStaff, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Projects', value: stats.totalProjects, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Total Tasks', value: stats.totalTasks, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Pending Tasks', value: stats.pendingTasks, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
        { label: 'Completed Tasks', value: stats.completedTasks, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    // const chartData = [
    //     { name: 'Pending', value: stats.pendingTasks, color: '#f59e0b' },
    //     { name: 'In Progress', value: stats.inProgressTasks, color: '#3b82f6' },
    //     { name: 'Completed', value: stats.completedTasks, color: '#10b981' },
    // ];

    if (loading) return <div className="animate-pulse space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>)}
        </div>
        <div className="h-96 bg-slate-200 rounded-xl"></div>
    </div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Overview</h1>
                <p className="text-slate-500">Insights and management at a glance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {statCards.map((stat, i) => (
                    <Card key={i} className="flex flex-col items-center justify-center text-center py-8">
                        <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} mb-4`}>
                            <stat.icon size={28} />
                        </div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                    </Card>
                ))}
            </div>
            {/* 
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Task Distribution">
                    <div className="h-80 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Staff Workload">
                    <div className="h-80 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={workloadData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {workloadData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][index % 5]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div> */}

            <Card title="Recent Activity" action={<button className="text-primary-600 text-sm font-semibold hover:underline">View All</button>}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-4">
                    {activities.length > 0 ? activities.map((activity, i) => (
                        <div key={activity._id || i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                            <div className="relative">
                                {activity.user?.profilePhoto ? (
                                    <img src={activity.user.profilePhoto} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                                        {activity.user?.name?.charAt(0) || '?'}
                                    </div>
                                )}
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white
                                    ${activity.action === 'CREATE' ? 'bg-emerald-500' :
                                        activity.action === 'UPDATE' ? 'bg-blue-500' :
                                            activity.action === 'DELETE' ? 'bg-rose-500' : 'bg-slate-500'}`}>
                                    {activity.action === 'CREATE' ? '+' : activity.action === 'UPDATE' ? '✎' : activity.action === 'DELETE' ? '×' : '•'}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-800 line-clamp-1">{activity.details}</p>
                                <p className="text-xs text-slate-400 mt-0.5 whitespace-nowrap">
                                    {new Date(activity.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                </p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-slate-400 text-sm py-4">No recent activity found.</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;
