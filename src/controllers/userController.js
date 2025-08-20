import { changeUserRole } from "../services/user.service.js";

// Controller for changing user roles
async function changeRoleController(req, res) {
  const { userId, newRole } = req.body;
  try {
    const user = await changeUserRole(userId, newRole);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export { changeRoleController };
