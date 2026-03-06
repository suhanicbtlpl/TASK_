const axios = require('axios');

async function testBackend() {
    try {
        const resStaff = await axios.get('http://localhost:3001/admin/getStaff');
        const resRoles = await axios.get('http://localhost:3001/admin/getRoles');
        const resTasks = await axios.get('http://localhost:3001/admin/getTasks');
        const resPerms = await axios.get('http://localhost:3001/admin/getPermissions');

        console.log("Staff Count:", resStaff.data.length);
        console.log("Roles Count:", resRoles.data.length);
        console.log("Tasks Count:", resTasks.data.length);
        console.log("Perms Count:", resPerms.data.length);

        console.log("All endpoints successfully returned data!");
    } catch (e) {
        console.error("Test failed:", e.message);
    }
}
testBackend();
