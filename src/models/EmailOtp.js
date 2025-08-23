import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";
import crypto from "crypto";

export class EmailOtp extends Model {
  static hashOtp(otp) {
    // Store only a hash of the OTP for security (DB leak safe)
    return crypto.createHash("sha256").update(String(otp)).digest("hex");
  }
}

EmailOtp.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    otpHash: { type: DataTypes.STRING, allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    usedAt: { type: DataTypes.DATE, allowNull: true },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "EmailOtp",
    indexes: [{ fields: ["expiresAt"] }],
  }
);
