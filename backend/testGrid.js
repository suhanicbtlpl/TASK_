const axios = require('axios');

async function testRoles() {
    try {
        const roles = await axios.get('http://localhost:3001/admin/getRoles');
        console.log("Current Roles:", roles.data.length);
        if (roles.data.length > 0) {
            const firstRole = roles.data[0];
            console.log("Updating Role:", firstRole.name);
            const updateRes = await axios.put(`http://localhost:3001/admin/updateRole/${firstRole._id}`, {
                name: firstRole.name,
                status: firstRole.status,
                permissions: ["CREATE_STAFF", "VIEW_ROLE", "DELETE_TASK"]
            });
            console.log("Update Success:", updateRes.data.message);
            console.log("Updated Role Perms:", updateRes.data.role.permissions);
        }
    } catch (e) {
        console.error("Test failed:", e.response ? e.response.data : e.message);
    }
}
testRoles();
