# 🚀 Beginner's Guide to Your Full-Stack Project

Welcome! You've inherited a powerful **Project Management System**. Imagine this as a digital office where teams can organize work, manage documents, and set permissions.

---

## 1. Project Overview
*   **What it does:** It helps teams manage Projects, Tasks, Staff, and Documents. It has a built-in security system (Roles & Permissions) so only authorized people can see sensitive data.
*   **Real-world Example:** A software company using this to track multiple client projects. The "Manager" creates projects, "Developers" update tasks, and "Clients" might only have permission to view progress.
*   **Who uses it:** Admins, Managers, and Employees.

---

## 2. Tech Stack
Think of these as the "Build Materials" for your house:
*   **Frontend (React + Tailwind):** The "Face" of the app. 
    *   *React* makes the UI fast and interactive. 
    *   *Tailwind* is the paint and decor (styling) that makes it look modern.
*   **Backend (Node.js + Express):** The "Brain" and "Nerve System". 
    *   It handles requests, checks security, and talks to the database.
*   **Database (MongoDB + Mongoose):** The "Memory Cabinet".
    *   *MongoDB* stores data like folders in a drawer. 
    *   *Mongoose* is the librarian who makes sure data fits the right shape.

---

## 3. Folder Structure
*   📁 **backend/**: The engine room.
    *   `server.js`: The "Start Button" for your server.
    *   `models/`: Defines the "Shape" of your data (e.g., what a "User" looks like).
    *   `routes/`: The "Entrance Doors" (URLs like `/api/projects`).
    *   `controllers/`: The "Staff" that does the actual work when you enter a door.
    *   `middleware/`: The "Security Guards" who check your ID before you enter.
*   📁 **frontend/**: The user's screen.
    *   `src/App.jsx`: The "Main Traffic Controller" for pages.
    *   `src/pages/`: The different screens (Dashboard, Project List, etc.).
    *   `src/components/`: Small reusable parts (Buttons, Headers).
    *   `src/services/api.js`: The "Phone Book" used to call the backend.

---

## 4. Frontend Flow (React)
1.  **Pages:** Each page is a separate file in `/pages`.
2.  **Components:** We break pages into small bits (like `Sidebar` or `Table`) to keep code clean.
3.  **Data Flow:**
    *   **Props:** Passing data like a relay race from parent to child.
    *   **State:** The component's "Short-term memory" (e.g., what's typed in a box).
    *   **Context (AuthContext):** The "Global Memory" that knows if you are logged in.
4.  **API Calls:** We use **Axios** (a messenger) to send requests to the backend.

---

## 5. Backend Flow (Express)
When a request comes in (e.g., "Show me my tasks"):
1.  **Route:** Finds the right URL door (`/api/tasks`).
2.  **Controller:** Decides what to do ("Get tasks for this user").
3.  **Service:** (Optional) Handles heavy logic like "Filter and Sort these tasks".
4.  **Model:** Fetches the data from the Database drawer.
5.  **Response:** Sends the data back to the Frontend.

---

## 6. Database Design
We use **Collections** (like spreadsheets):
*   **Users:** Names, emails, and passwords.
*   **Roles:** Names of roles (Admin, Staff).
*   **Projects:** Name, description, and "Who is assigned?".
*   **Tasks:** Status (Todo/Done), deadline, and which project it belongs to.
*   **Relationships:** A **Project** has many **Tasks**. A **User** belongs to one **Role**.

---

## 7. Authentication & Authorization
*   **Authentication (Login):** "Who are you?" (Checking email/password).
*   **Authorization (Permissions):** "What are you allowed to do?" (Can you delete a project?).
*   **JWT (The Token):** When you login, the server gives you a "Digital ID Card" (Token). Your browser saves it and shows it on every request.

---

## 8. End-to-End Flow
**Example: Creating a new Project**
1.  **You:** Click "Create Project" on the screen.
2.  **Frontend:** Collects the name/desc and sends an API call with your "ID Card" (Token).
3.  **Backend Middleware:** Checks if your Token is valid.
4.  **Backend Controller:** Asks "Does this user have `Project_CREATE` permission?".
5.  **Database:** If yes, it saves the project.
6.  **Success:** Frontend receives a "Done!" and updates the list.

---

## 9. Important Concepts
*   **JWT (JSON Web Token):** A secure way to stay logged in without sending your password every time.
*   **Middleware:** Functions that run *between* the request and the final action (like a security check).
*   **CRUD:** **C**reate, **R**ead, **U**pdate, **D**elete. The 4 basic things you do with any data.
*   **REST API:** A structured way for the frontend and backend to talk via URLs.

---

## 10. Common Mistakes & Tips
*   **Mistake:** Forgetting to send the Token in the header (Backend will say "401 Not Authorized").
*   **Mistake:** Not checking permissions on the backend (Always verify even if the UI hides the button!).
*   **Tip:** Use the **Dashboard** to get a quick summary of everything.
*   **Tip:** Check the **Audit Logs** (Activities) if you're wondering "Who deleted that project?".

---
### 💡 How to explore further?
Try adding a small feature: Change the color of a button in `src/components/shared/UIComponents.jsx` or add a new field to the `Project.js` model!
