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

// --- Response Normalization Helpers ---
// These helpers extract the actual data from the API response envelope { success: true, message: "...", data: { ... } }

/**
 * Normalizes paginated responses into a consistent format for the UI.
 */
const formatPaginatedResponse = (response) => {
    const payload = response.data?.data; // Unwrap the 'data' from the common response envelope
    return {
        data: Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [],
        total: payload?.total || 0,
        pages: payload?.pages || 1,
        page: payload?.page || 1,
    };
};

/**
 * Extracts a simple list/array from the response data.
 */
const formatListResponse = (response) => {
    const payload = response.data?.data;
    if (Array.isArray(payload?.data)) return payload.data; // Handle cases where data is nested
    if (Array.isArray(payload)) return payload;
    return [];
};

/**
 * Extracts a single object from the response data.
 */
const formatSingleResponse = (response) => response.data?.data || response.data || null;

// ── AUTH ──────────────────────────────────────────────────────────────────────
export const authService = {
    login: (credentials) => api.post('/auth/login', credentials).then(formatSingleResponse),
    getProfile: () => api.get('/auth/profile').then(formatSingleResponse),
    updateProfile: (formData) => api.put('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(formatSingleResponse),
    changePassword: (passwords) => api.put('/auth/change-password', passwords).then(formatSingleResponse),
    updateSettings: (settings) => api.put('/auth/settings', settings).then(formatSingleResponse),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }).then(formatSingleResponse),
    resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }).then(formatSingleResponse),
    registerCompany: (data) => api.post('/auth/register-company', data).then(formatSingleResponse),
};

// ── STAFF ─────────────────────────────────────────────────────────────────────
export const staffService = {
    getStaff: (params) => api.get('/staff', { params }).then(formatPaginatedResponse),
    getDeletedStaff: (params) => api.get('/staff/deleted', { params }).then(formatPaginatedResponse),
    createStaff: (data) => api.post('/staff', data).then(formatSingleResponse),
    updateStaff: (id, data) => api.put(`/staff/${id}`, data).then(formatSingleResponse),
    deleteStaff: (id) => api.delete(`/staff/${id}`).then(formatSingleResponse),
    restoreStaff: (id) => api.put(`/staff/${id}/restore`).then(formatSingleResponse),
    permanentDeleteStaff: (id) => api.delete(`/staff/${id}/permanent`).then(formatSingleResponse),
};

    // ── ROLES ─────────────────────────────────────────────────────────────────────
    export const roleService = {
        getRoles: (params) => api.get('/roles', { params }).then(formatPaginatedResponse),
        getDeletedRoles: (params) => api.get('/roles/deleted', { params }).then(formatPaginatedResponse),
        createRole: (data) => api.post('/roles', data).then(formatSingleResponse),
        updateRole: (id, data) => api.put(`/roles/${id}`, data).then(formatSingleResponse),
        deleteRole: (id) => api.delete(`/roles/${id}`).then(formatSingleResponse),
        restoreRole: (id) => api.put(`/roles/${id}/restore`).then(formatSingleResponse),
        permanentDeleteRole: (id) => api.delete(`/roles/${id}/permanent`).then(formatSingleResponse),
    };

// ── PROJECTS ──────────────────────────────────────────────────────────────────
export const projectService = {
    getProjects: (params) => api.get('/projects', { params }).then(formatPaginatedResponse),
    getDeletedProjects: (params) => api.get('/projects/deleted', { params }).then(formatPaginatedResponse),
    createProject: (data) => api.post('/projects', data).then(formatSingleResponse),
    updateProject: (id, data) => api.put(`/projects/${id}`, data).then(formatSingleResponse),
    deleteProject: (id) => api.delete(`/projects/${id}`).then(formatSingleResponse),
    restoreProject: (id) => api.put(`/projects/${id}/restore`).then(formatSingleResponse),
    permanentDeleteProject: (id) => api.delete(`/projects/${id}/permanent`).then(formatSingleResponse),
};

// ── TASKS ─────────────────────────────────────────────────────────────────────
export const taskService = {
    getTasks: (params) => api.get('/tasks', { params }).then(formatPaginatedResponse),
    getTasksByProject: (projectId, params) => api.get(`/tasks/project/${projectId}`, { params }).then(formatPaginatedResponse),
    getDeletedTasks: (params) => api.get('/tasks/deleted', { params }).then(formatPaginatedResponse),
    createTask: (data) => api.post('/tasks', data).then(formatSingleResponse),
    updateTask: (id, data) => api.put(`/tasks/${id}`, data).then(formatSingleResponse),
    deleteTask: (id) => api.delete(`/tasks/${id}`).then(formatSingleResponse),
    restoreTask: (id) => api.put(`/tasks/${id}/restore`).then(formatSingleResponse),
    permanentDeleteTask: (id) => api.delete(`/tasks/${id}/permanent`).then(formatSingleResponse),
};

// ── PERMISSIONS ───────────────────────────────────────────────────────────────
export const permissionService = {
    getPermissions: (params) => api.get('/permissions', { params }).then(formatPaginatedResponse),
    getDeletedPermissions: (params) => api.get('/permissions/deleted', { params }).then(formatPaginatedResponse),
    createPermission: (data) => api.post('/permissions', data).then(formatSingleResponse),
    updatePermission: (id, data) => api.put(`/permissions/${id}`, data).then(formatSingleResponse),
    deletePermission: (id) => api.delete(`/permissions/${id}`).then(formatSingleResponse),
    restorePermission: (id) => api.put(`/permissions/${id}/restore`).then(formatSingleResponse),
    permanentDeletePermission: (id) => api.delete(`/permissions/${id}/permanent`).then(formatSingleResponse),
};

// ── DOCUMENTS ─────────────────────────────────────────────────────────────────
export const documentService = {
    getDocuments: (params) => api.get('/documents', { params }).then(formatPaginatedResponse),
    getDeletedDocuments: (params) => api.get('/documents/deleted', { params }).then(formatPaginatedResponse),
    uploadDocument: (formData) => api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(formatSingleResponse),
    addVersion: (id, formData) => api.post(`/documents/${id}/version`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(formatSingleResponse),
    updateDocument: (id, data) => api.put(`/documents/${id}`, data).then(formatSingleResponse),
    deleteDocument: (id) => api.delete(`/documents/${id}`).then(formatSingleResponse),
    restoreDocument: (id) => api.put(`/documents/${id}/restore`).then(formatSingleResponse),
    permanentDeleteDocument: (id) => api.delete(`/documents/${id}/permanent`).then(formatSingleResponse),
};

// ── ACTIVITY ──────────────────────────────────────────────────────────────────
export const activityService = {
    getRecentActivities: (limit) => api.get('/activities/recent', { params: { limit } }).then(
        (response) => Array.isArray(response.data?.data) ? response.data.data : []
    ),
};

// ── ISSUES ────────────────────────────────────────────────────────────────────
export const issueService = {
    getIssues: (params) => api.get('/issues', { params }).then(formatPaginatedResponse),
    getDeletedIssues: (params) => api.get('/issues/deleted', { params }).then(formatPaginatedResponse),
    createIssue: (data) => api.post('/issues', data).then(formatSingleResponse),
    updateIssue: (id, data) => api.put(`/issues/${id}`, data).then(formatSingleResponse),
    deleteIssue: (id) => api.delete(`/issues/${id}`).then(formatSingleResponse),
    restoreIssue: (id) => api.put(`/issues/${id}/restore`).then(formatSingleResponse),
    permanentDeleteIssue: (id) => api.delete(`/issues/${id}/permanent`).then(formatSingleResponse),
};

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
export const notificationService = {
    getNotifications: () => api.get('/notifications').then(
        (response) => Array.isArray(response.data?.data) ? response.data.data : []
    ),
    markRead: (id) => api.put(`/notifications/${id}/read`).then(formatSingleResponse),
    markAllRead: () => api.put('/notifications/read-all').then(formatSingleResponse),
};

// ── COMPANIES ────────────────────────────────────────────────────────────────
export const companyService = {
    getCompanies: (params) => api.get('/company', { params }).then(formatPaginatedResponse),
    getCompanyById: (id) => api.get(`/company/${id}`).then(formatSingleResponse),
    deleteCompany: (id) => api.delete(`/company/${id}`).then(formatSingleResponse),
};

export default api;
