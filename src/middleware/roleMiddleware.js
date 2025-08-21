import { MerchantUser } from "../models/MerchantUser.js";

export function requireRole(allowedRoles = []) {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const merchantId =
        req.merchantId || req.params.merchantId || req.query.merchantId;

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized: No user in request",
        });
      }

      if (!merchantId) {
        return res.status(400).json({
          success: false,
          error: "Merchant ID is required",
        });
      }

      const merchantUser = await MerchantUser.findOne({
        where: { userId: user.id, merchantId },
      });

      if (!merchantUser) {
        return res.status(403).json({
          success: false,
          error: "Forbidden: User is not associated with this merchant",
        });
      }

      if (!allowedRoles.includes(merchantUser.role)) {
        return res.status(403).json({
          success: false,
          error: `Forbidden: Requires role ${allowedRoles.join(" or ")}`,
        });
      }

      req.merchantUser = merchantUser;

      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: "Server error in role middleware",
      });
    }
  };
}
