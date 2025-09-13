import {
  changeUserRole,
  getAllUsers,
  getSignedInUserDetails,
} from "../services/user.service.js";

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

// Controller for getting all users
async function getAllUsersController(req, res) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller for getting signed-in user details
async function getSignedInUserDetailsController(req, res) {
  const userId = req.user.id;
  try {
    const user = await getSignedInUserDetails(userId);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

export {
  changeRoleController,
  getAllUsersController,
  getSignedInUserDetailsController,
};
