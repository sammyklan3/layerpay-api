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
  } else if (user.status === "inactive") {
    throw new Error("User is inactive");
  } else if (user.role === newRole) {
    throw new Error("User already has this role");
  }
  user.role = newRole;
  await user.save();
  return user;
};

// Get all users
const getAllUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ["passwordHash"] },
  });
};

export { changeUserRole, getAllUsers };
