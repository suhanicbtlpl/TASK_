# 📡 API Layer Deep Dive: Understanding Axios & Services

This guide explains how your frontend talks to your backend using **Axios** and the **Service Layer**.

---

## 1. THE AXIOS INSTANCE (`api.js` lines 3-5)
Instead of calling `axios` directly everywhere, we create a **custom instance** named `api`:

```javascript
const api = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
});
```

*   **Why a separate instance?** It allows us to set defaults (like the `baseURL`) once. If the backend URL changes, you only change it here, not in 50 files.
*   **What is `baseURL`?** It's the "home address" of your server. Every call you make (like `/roles`) will automatically be prefixed with this URL.

---

## 2. REQUEST INTERCEPTOR (`api.js` lines 8-15)
Think of an interceptor as a **Security Guard** who checks every outgoing letter before it's mailed.

```javascript
api.interceptors.request.use((config) => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const { token } = JSON.parse(storedUser);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

*   **When it runs:** Just before the request leaves your browser.
*   **What it does:** 
    1.  Looks in `localStorage` for a saved user.
    2.  Extracts the **JWT Token**.
    3.  Attaches it to the `Authorization` header.
*   **Real-world Purpose:** This is how the server knows *who* you are. Without this, the server would reject every request as "Unauthorized".

---

## 3. RESPONSE INTERCEPTOR (`api.js` lines 18-29)
This is like a **Receptionist** who checks every incoming package before giving it to you.

```javascript
if (error.response?.status === 401) {
    localStorage.removeItem('user');
    window.location.href = '/login';
}
```

*   **When it runs:** After the server sends a response back, but before your "Service" receives it.
*   **Why check for 401?** A `401 Unauthorized` error usually means your token has **expired**.
*   **Automatic Logout:** If the token is dead, we wipe the `localStorage` and kick the user back to the login page. This is a standard security practice.

---

## 4. DATA FLOW TRACE: `getRoles()`
Let's see the journey of data:

1.  **Component:** `Roles.jsx` calls `roleService.getRoles()`.
2.  **Service:** `roleService` calls `api.get('/roles')`.
3.  **Request Interceptor:** Adds the `Bearer token` to the header.
4.  **Network:** Request hits `http://localhost:5000/api/v1/roles`.
5.  **Backend:** Processes DB query -> Returns JSON.
6.  **Response Interceptor:** Checks if status is 200 (OK). Passes data through.
7.  **Helper:** `paginated()` catches the response and cleans up the data structure.
8.  **Component:** Receives a clean array of roles and sets state.

---

## 5. NORMALIZATION HELPERS (`api.js` lines 32-51)
Backend responses often look like this: `{ success: true, data: { data: [...], total: 50 } }`.
Our helpers (`paginated`, `list`, `single`) "unwrap" this for us:

*   **Problem:** If the backend changes its response structure (e.g., changes `data` to `payload`), you only fix it in the **Helper**, not in every single component.
*   **Normalization:** It ensures the frontend always receives data in a consistent format (e.g., always an array for lists).

---

## 6. SERVICE LAYER DESIGN
We group APIs into objects like `authService`, `roleService`, etc.

*   **Why?** It keeps the components "clean". Components should only care about **UI**, not about URLs, headers, or data formatting. 
*   **Centralization:** If you need to change how "Passwords" are updated, you only look in `authService`.

---

## 7. IF REQUIREMENTS CHANGE

| If you want to change... | Modify this code in `api.js` |
| :--- | :--- |
| **API Base URL** | The `baseURL` in line 4. |
| **Token Storage** | Change `localStorage.getItem` in line 9 (e.g., to `sessionStorage`). |
| **Logout Logic** | Update the `if (401)` block in line 21. |
| **Response Format** | Update the `paginated`, `list`, or `single` helpers in lines 32-51. |

---
### 💡 Summary
Your API layer is the **bridge** between your app and its brain (the server). Because it's centralized in `api.js`, you have one place to control security, error handling, and data shapes!
