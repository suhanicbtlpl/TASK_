import React, { useState, useEffect } from 'react';
import { 
    Users, 
    Briefcase, 
    CheckSquare, 
    ShieldCheck, 
    Key, 
    FileText,
    AlertCircle
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

import RecycleBinTabs from '../components/recycleBin/RecycleBinTabs';
import RecycleBinTable from '../components/recycleBin/RecycleBinTable';

const RecycleBin = () => {
    const [activeTab, setActiveTab] = useState('staff');
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

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
            const res = await currentTab.fetch({ page, limit: 10 });
            setItems(res.data || []);
            setPagination({
                page: res.page,
                total: res.total,
                pages: res.pages
            });
        } catch (error) {
            console.error(`Error fetching deleted ${activeTab}:`, error);
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
            alert(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)} restored successfully`);
        } catch (error) {
            alert(`Error restoring: ${error.message}`);
        }
    };

    const handlePermanentDelete = async (id) => {
        if (!window.confirm(`Are you absolutely sure? This will PERMANENTLY delete this item and CANNOT be undone.`)) {
            return;
        }
        try {
            await currentTab.permanent(id);
            fetchData(pagination.page);
        } catch (error) {
            alert(`Error deleting: ${error.message}`);
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
            case 'permissions': return item.permissionGroup || 'N/A';
            case 'documents': return item.fileType;
            default: return '';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recycle Bin</h1>
                <p className="text-slate-500">Restore or permanently delete removed items</p>
            </div>

            <RecycleBinTabs 
                tabs={tabs} 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
            />

            <RecycleBinTable 
                items={items}
                loading={loading}
                activeTab={activeTab}
                onRestore={handleRestore}
                onPermanentDelete={handlePermanentDelete}
                getDisplayName={getDisplayName}
                getDisplayDetail={getDisplayDetail}
            />

            {/* Pagination */}
            {!loading && items.length > 0 && (
                <div className="flex items-center justify-between px-2">
                    <span className="text-sm text-slate-500">
                        Total items: <span className="font-semibold text-slate-900">{pagination.total}</span>
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
    );
};

export default RecycleBin;
