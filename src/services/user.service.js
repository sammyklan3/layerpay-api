import { User } from "../models/User.js";

// Change role of a user
const changeUserRole = async (userId, newRole) => {
    const requiredFields = { userId, newRole };
    for (const [key, value] of Object.entries(requiredFields)) {
        if (!value) {
            throw new Error(`${key} is required`);
        }
    }

    // Check if the new role is valid
    const validRoles = ["admin", "developer"];
    if (!validRoles.includes(newRole)) {
        throw new Error("Invalid role");
    }

  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.role = newRole;
  await user.save();
  return user;
};

export { changeUserRole };