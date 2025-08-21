export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized: No user in request",
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          error: `Forbidden: Requires role ${allowedRoles.join(" or ")}`,
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: "Server error in role middleware",
      });
    }
  };
}
