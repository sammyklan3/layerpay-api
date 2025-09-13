import { User } from "../models/User.js";
import { MerchantUser } from "../models/MerchantUser.js";

// Change role of a user within a merchant
const changeUserRole = async (userId, merchantId, newRole) => {
  const requiredFields = { userId, merchantId, newRole };
  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value) {
      throw new Error(`${key} is required`);
    }
  }

  // Check if the new role is valid
  const validRoles = ["owner", "admin", "developer", "viewer"];
  if (!validRoles.includes(newRole)) {
    throw new Error("Invalid role");
  }

  // Ensure user exists and is active
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  } else if (user.status === "inactive") {
    throw new Error("User is inactive");
  }

  // Find MerchantUser record
  const merchantUser = await MerchantUser.findOne({
    where: { userId, merchantId },
  });

  if (!merchantUser) {
    throw new Error("User is not associated with this merchant");
  }

  if (merchantUser.role === newRole) {
    throw new Error("User already has this role");
  }

  // Update role
  merchantUser.role = newRole;
  await merchantUser.save();

  return merchantUser;
};

// Get all users
const getAllUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ["passwordHash"] },
  });
};

// Get signed in user details
const getSignedInUserDetails = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["passwordHash"] },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export { changeUserRole, getAllUsers, getSignedInUserDetails };
