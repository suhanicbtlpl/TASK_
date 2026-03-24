import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
});

// --- Request Interceptor: attach JWT ---
api.interceptors.request.use((config) => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const { token } = JSON.parse(storedUser);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- Response Interceptor: only handle 401 ---
api.interceptors.response.use(
    (response) => response, // Return raw response — each service normalizes its own data
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
        // const message = error.response?.data?.message || error.message || 'Something went wrong';
        // return Promise.reject(new Error(message));
    }
);

// Helper: extract paginated payload from standard { success, data: { data, total, pages, page } }
const paginated = (res) => {
    const payload = res.data?.data; // unwrap success envelope
    return {
        data: Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [],
        total: payload?.total || 0,
        pages: payload?.pages || 1,
        page: payload?.page || 1,
    };
};

// Helper: extract simple list from standard { success, data: [] }
const list = (res) => {
    const payload = res.data?.data;
    if (Array.isArray(payload?.data)) return payload.data; // nested paginated
    if (Array.isArray(payload)) return payload;
    return [];
};

// Helper: extract single object
const single = (res) => res.data?.data || res.data || null;

// ── AUTH ──────────────────────────────────────────────────────────────────────
export const authService = {
    login: (credentials) => api.post('/auth/login', credentials).then(single),
    getProfile: () => api.get('/auth/profile').then(single),
    updateProfile: (formData) => api.put('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(single),
    changePassword: (passwords) => api.put('/auth/change-password', passwords).then(single),
    updateSettings: (settings) => api.put('/auth/settings', settings).then(single),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }).then(single),
    resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }).then(single),
};

// ── STAFF ─────────────────────────────────────────────────────────────────────
export const staffService = {
    getStaff: (params) => api.get('/staff', { params }).then(paginated),
    getDeletedStaff: (params) => api.get('/staff/deleted', { params }).then(paginated),
    createStaff: (data) => api.post('/staff', data).then(single),
    updateStaff: (id, data) => api.put(`/staff/${id}`, data).then(single),
    deleteStaff: (id) => api.delete(`/staff/${id}`).then(single),
    restoreStaff: (id) => api.put(`/staff/${id}/restore`).then(single),
    permanentDeleteStaff: (id) => api.delete(`/staff/${id}/permanent`).then(single),
};

    // ── ROLES ─────────────────────────────────────────────────────────────────────
    export const roleService = {
        getRoles: (params) => api.get('/roles', { params }).then(paginated),
        getDeletedRoles: (params) => api.get('/roles/deleted', { params }).then(paginated),
        createRole: (data) => api.post('/roles', data).then(single),
        updateRole: (id, data) => api.put(`/roles/${id}`, data).then(single),
        deleteRole: (id) => api.delete(`/roles/${id}`).then(single),
        restoreRole: (id) => api.put(`/roles/${id}/restore`).then(single),
        permanentDeleteRole: (id) => api.delete(`/roles/${id}/permanent`).then(single),
    };

// ── PROJECTS ──────────────────────────────────────────────────────────────────
export const projectService = {
    getProjects: (params) => api.get('/projects', { params }).then(paginated),
    getDeletedProjects: (params) => api.get('/projects/deleted', { params }).then(paginated),
    createProject: (data) => api.post('/projects', data).then(single),
    updateProject: (id, data) => api.put(`/projects/${id}`, data).then(single),
    deleteProject: (id) => api.delete(`/projects/${id}`).then(single),
    restoreProject: (id) => api.put(`/projects/${id}/restore`).then(single),
    permanentDeleteProject: (id) => api.delete(`/projects/${id}/permanent`).then(single),
};

// ── TASKS ─────────────────────────────────────────────────────────────────────
export const taskService = {
    getTasks: (params) => api.get('/tasks', { params }).then(paginated),
    getTasksByProject: (projectId, params) => api.get(`/tasks/project/${projectId}`, { params }).then(paginated),
    getDeletedTasks: (params) => api.get('/tasks/deleted', { params }).then(paginated),
    createTask: (data) => api.post('/tasks', data).then(single),
    updateTask: (id, data) => api.put(`/tasks/${id}`, data).then(single),
    deleteTask: (id) => api.delete(`/tasks/${id}`).then(single),
    restoreTask: (id) => api.put(`/tasks/${id}/restore`).then(single),
    permanentDeleteTask: (id) => api.delete(`/tasks/${id}/permanent`).then(single),
};

// ── PERMISSIONS ───────────────────────────────────────────────────────────────
export const permissionService = {
    getPermissions: (params) => api.get('/permissions', { params }).then(paginated),
    getDeletedPermissions: (params) => api.get('/permissions/deleted', { params }).then(paginated),
    createPermission: (data) => api.post('/permissions', data).then(single),
    updatePermission: (id, data) => api.put(`/permissions/${id}`, data).then(single),
    deletePermission: (id) => api.delete(`/permissions/${id}`).then(single),
    restorePermission: (id) => api.put(`/permissions/${id}/restore`).then(single),
    permanentDeletePermission: (id) => api.delete(`/permissions/${id}/permanent`).then(single),
};

// ── DOCUMENTS ─────────────────────────────────────────────────────────────────
export const documentService = {
    getDocuments: (params) => api.get('/documents', { params }).then(paginated),
    getDeletedDocuments: (params) => api.get('/documents/deleted', { params }).then(paginated),
    uploadDocument: (formData) => api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(single),
    addVersion: (id, formData) => api.post(`/documents/${id}/version`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(single),
    updateDocument: (id, data) => api.put(`/documents/${id}`, data).then(single),
    deleteDocument: (id) => api.delete(`/documents/${id}`).then(single),
    restoreDocument: (id) => api.put(`/documents/${id}/restore`).then(single),
    permanentDeleteDocument: (id) => api.delete(`/documents/${id}/permanent`).then(single),
};

// ── ACTIVITY ──────────────────────────────────────────────────────────────────
export const activityService = {
    getRecentActivities: (limit) => api.get('/activities/recent', { params: { limit } }).then(
        (res) => Array.isArray(res.data?.data) ? res.data.data : []
    ),
};

// ── ISSUES ────────────────────────────────────────────────────────────────────
export const issueService = {
    getIssues: (params) => api.get('/issues', { params }).then(paginated),
    getDeletedIssues: (params) => api.get('/issues/deleted', { params }).then(paginated),
    createIssue: (data) => api.post('/issues', data).then(single),
    updateIssue: (id, data) => api.put(`/issues/${id}`, data).then(single),
    deleteIssue: (id) => api.delete(`/issues/${id}`).then(single),
    restoreIssue: (id) => api.put(`/issues/${id}/restore`).then(single),
    permanentDeleteIssue: (id) => api.delete(`/issues/${id}/permanent`).then(single),
};

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
export const notificationService = {
    getNotifications: () => api.get('/notifications').then(
        (res) => Array.isArray(res.data?.data) ? res.data.data : []
    ),
    markRead: (id) => api.put(`/notifications/${id}/read`).then(single),
    markAllRead: () => api.put('/notifications/read-all').then(single),
};

export default api;
