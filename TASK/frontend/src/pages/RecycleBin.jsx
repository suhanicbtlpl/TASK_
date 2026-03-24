import React, { useState, useEffect } from 'react';
import { 
    RefreshCcw, 
    Trash2, 
    Users, 
    Briefcase, 
    CheckSquare, 
    ShieldCheck, 
    Key, 
    FileText,
    Search,
    AlertCircle,
    Info
} from 'lucide-react';
import { 
    staffService, 
    roleService, 
    projectService, 
    taskService, 
    permissionService, 
    documentService,
    issueService
} from '../services/api';


const RecycleBin = () => {
    const [activeTab, setActiveTab] = useState('staff');
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
    const [searchTerm, setSearchTerm] = useState('');

    const tabs = [
        { id: 'staff', name: 'Staff', icon: Users, fetch: staffService.getDeletedStaff, restore: staffService.restoreStaff, permanent: staffService.permanentDeleteStaff },
        { id: 'roles', name: 'Roles', icon: ShieldCheck, fetch: roleService.getDeletedRoles, restore: roleService.restoreRole, permanent: roleService.permanentDeleteRole },
        { id: 'projects', name: 'Projects', icon: Briefcase, fetch: projectService.getDeletedProjects, restore: projectService.restoreProject, permanent: projectService.permanentDeleteProject },
        { id: 'tasks', name: 'Tasks', icon: CheckSquare, fetch: taskService.getDeletedTasks, restore: taskService.restoreTask, permanent: taskService.permanentDeleteTask },
        { id: 'issues', name: 'Issues', icon: AlertCircle, fetch: issueService.getDeletedIssues, restore: issueService.restoreIssue, permanent: issueService.permanentDeleteIssue },
        { id: 'permissions', name: 'Permissions', icon: Key, fetch: permissionService.getDeletedPermissions, restore: permissionService.restorePermission, permanent: permissionService.permanentDeletePermission },
        { id: 'documents', name: 'Documents', icon: FileText, fetch: documentService.getDeletedDocuments, restore: documentService.restoreDocument, permanent: documentService.permanentDeleteDocument },
    ];

    const currentTab = tabs.find(t => t.id === activeTab);

    const fetchData = async (page = 1) => {
        setLoading(true);
        try {
            const res = await currentTab.fetch({ page, limit: 10, search: searchTerm });
            setItems(res.data || []);
            setPagination({
                page: res.page,
                total: res.total,
                pages: res.pages
            });
        } catch (error) {
            console.error(`Error fetching deleted ${activeTab}: ` + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(1);
    }, [activeTab]);

    const handleRestore = async (id) => {
        try {
            await currentTab.restore(id);
            fetchData(pagination.page);
        } catch (error) {
            alert(`Error restoring ${activeTab}: ` + error.message);
        }
    };

    const handlePermanentDelete = async (id) => {
        if (!window.confirm(`Are you absolutely sure? This will PERMANENTLY delete this ${activeTab.slice(0, -1)} and CANNOT be undone.`)) {
            return;
        }
        try {
            await currentTab.permanent(id);
            fetchData(pagination.page);
        } catch (error) {
            alert(`Error permanently deleting ${activeTab}: ` + error.message);
        }
    };

    const getDisplayName = (item) => {
        switch (activeTab) {
            case 'staff': return item.name;
            case 'roles': return item.roleName;
            case 'projects': return item.name;
            case 'tasks': return item.title;
            case 'issues': return item.title;
            case 'permissions': return item.permissionName;
            case 'documents': return item.title;
            default: return 'Unknown';
        }
    };

    const getDisplayDetail = (item) => {
        switch (activeTab) {
            case 'staff': return item.email;
            case 'roles': return `${item.permissions?.length || 0} permissions`;
            case 'projects': return item.clientName || 'N/A';
            case 'tasks': return item.status;
            case 'issues': return item.status;
            case 'permissions': return 'N/A';
            case 'documents': return item.fileType;
            default: return '';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Recycle Bin</h1>
                    <p className="text-slate-500">Restore soft-deleted items across all modules</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto pb-2 gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap
                            ${activeTab === tab.id 
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' 
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}
                        `}
                    >
                        <tab.icon size={18} />
                        <span className="font-medium">{tab.name}</span>
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2 text-slate-600">
                        <AlertCircle size={18} />
                        <span className="text-sm font-medium">Deleted items will be preserved unless permanently removed.</span>
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4">
                        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                        <p className="text-slate-500 animate-pulse">Loading deleted items...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Trash2 className="text-slate-400" size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">No deleted items</h3>
                        <p className="text-slate-500 max-w-xs mx-auto">The recycle bin is empty for the {activeTab} module.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Name / Title</th>
                                    <th className="px-6 py-4">Detail</th>
                                    <th className="px-6 py-4">Deleted At</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {items.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{getDisplayName(item)}</div>
                                            <div className="text-xs text-slate-400">ID: {item._id}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-600">{getDisplayDetail(item)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-500">
                                                {new Date(item.updatedAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleRestore(item._id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                                                    title="Restore"
                                                >
                                                    <RefreshCcw size={14} />
                                                    Restore
                                                </button>
                                                <button
                                                    onClick={() => handlePermanentDelete(item._id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                                    title="Permanently Delete"
                                                >
                                                    <Trash2 size={14} />
                                                    Delete Permanently
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {items.length > 0 && (
                    <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                            Showing <span className="font-medium">{items.length}</span> items
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={pagination.page === 1}
                                onClick={() => fetchData(pagination.page - 1)}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-slate-50 transition-all shadow-sm"
                            >
                                Previous
                            </button>
                            <button
                                disabled={pagination.page === pagination.pages}
                                onClick={() => fetchData(pagination.page + 1)}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-slate-50 transition-all shadow-sm"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecycleBin;
