# 🛠️ Technical Master Guide: How Your Code Works

This guide is designed for developers who need to modify the code. No fluff—just the actual flow of data.

---

## 1. BIG PICTURE FLOW
When a user does something (like clicking a button), the data travels through this "pipeline":

**User Action** (Click) → **React Component** (UI) → **Service** (Axios Call) → **Backend Route** (URL) → **Middleware** (Security Check) → **Controller** (Request Handler) → **Service** (Business Logic) → **Model** (Database Schema) → **Database** (Storage) → **Success/Error Response** → **UI Update**

---

## 2. TRACING REAL EXAMPLES

### Example A: "Fetch Roles List" (Reading Data)
1.  **Trigger:** Navigation to `/roles` runs `useEffect` in `Roles.jsx`.
2.  **Function:** `fetchRoles()` calls `roleService.getRoles({ page, limit, search })`.
3.  **API Call:** `GET http://localhost:5000/api/v1/roles?page=1...`
4.  **Backend Route:** `roleRoutes.js` detects the `GET /` request.
5.  **Middleware:** `protect` checks the token; `checkPermission('Role_READ')` verifies the user's role.
6.  **Controller:** `roleController.js` calls `RoleService.getAll()`.
7.  **Service:** `RoleService.js` uses `BaseService` to query MongoDB and populates permissions.
8.  **Response:** A JSON object with `success: true` and the roles array is sent back.
9.  **UI Update:** `setRoles(res.data)` triggers a re-render, showing the table.

### Example B: "Create New Role" (Writing Data)
1.  **Trigger:** Clicking "Create Role" in the Modal runs `handleSubmit` in `Roles.jsx`.
2.  **Function:** `roleService.createRole(formData)` sends the data.
3.  **API Call:** `POST http://localhost:5000/api/v1/roles` (Body: `{ roleName, permissions, status }`).
4.  **Backend Route:** `roleRoutes.js` detects `POST /`.
5.  **Middleware:** `protect`, `checkPermission('Role_CREATE')`, and `validate` (checks fields).
6.  **Controller:** `roleController.js` calls `RoleService.create()`.
7.  **Logic:** Service saves the data to MongoDB via `Role.js` model.
8.  **Response:** `201 Created` status with the new role object.
9.  **UI Update:** `setIsModalOpen(false)` closes the modal; `fetchRoles()` refreshes the table.

---

## 3. FILE-BY-FILE EXPLANATION

| File | What it does | When/Who calls it |
| :--- | :--- | :--- |
| **`App.jsx`** | Defines all pages and their permissions. | Runs on app start. |
| **`services/api.js`** | The central place for all API calls. | Called by Pages (`Roles.jsx`, `Staff.jsx`). |
| **`roleRoutes.js`** | Maps URLs to Controller functions. | Called by Express for `/api/v1/roles`. |
| **`roleController.js`**| Handles the request/response logic. | Called by the Routes. |
| **`RoleService.js`** | Deep logic (filtering, populating). | Called by the Controller. |
| **`models/Role.js`** | Defines what a Role "is" in the DB. | Called by Services/Mongoose. |

---

## 4. DATA FLOW DEEP DIVE (The "Axios Interceptor")
*   **Where it starts:** `api.js` line 8.
*   **The Magic:** Every time you call a service, the **Request Interceptor** automatically grabs your Token from `localStorage` and attaches it to the header as `Authorization: Bearer <token>`.
*   **Security Check:** On the backend, `authMiddleware.js` (line 7) catches this token, decodes it, and finds the user in the database.
*   **The Result:** The Controller doesn't have to worry about "Who is this?"; it just uses `req.user`.

---

## 5. HOW TO CHANGE REQUIREMENTS

### Task: Add a new field "Description" to Roles
1.  **Backend Model:** Add `description: { type: String }` in `backend/models/Role.js`.
2.  **Backend Controller:** Update `createRole` in `roleController.js` to extract `description` from `req.body`.
3.  **Frontend Modal:** In `Roles.jsx`, add a new `<Input />` field for Description.
4.  **Frontend State:** Update the `formData` object in `Roles.jsx` to include `description: ''`.

### Task: Add a New Module (e.g., "Vendors")
1.  **Create Model:** `backend/models/Vendor.js`.
2.  **Create Service:** `backend/services/VendorService.js` (copy `RoleService.js` and change the name).
3.  **Create Controller:** `backend/controllers/vendorController.js`.
4.  **Create Routes:** `backend/routes/vendorRoutes.js` and register it in `server.js`.
5.  **Frontend Service:** Add `vendorService` to `frontend/src/services/api.js`.
6.  **Frontend Page:** Create `frontend/src/pages/Vendors.jsx`.
7.  **App Routing:** Add the route to `App.jsx` with a `ProtectedRoute`.

---

## 6. DEBUGGING GUIDE
1.  **The "Network Tab" (F12):** Check this first. If the request fails, look at the "Response" sub-tab.
    *   `401`: Token missing or expired.
    *   `403`: You lack permission (check `checkPermission` middleware).
    *   `500`: The backend crashed (Check the terminal running `npm start`).
2.  **Console Logs:** 
    *   On Backend: Use `console.log(req.body)` inside the controller to see what arrived.
    *   On Frontend: Use `console.log(res)` in the service to see what came back.

---
### 💡 Pro Tip
Always keep your **Frontend Terminal** (`npm run dev`) and **Backend Terminal** (`npm start`) open. If you see red text in either, that's your first clue!
