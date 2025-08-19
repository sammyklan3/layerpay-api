import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export class MerchantUser extends Model {}

MerchantUser.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    role: {
      type: DataTypes.ENUM("owner", "admin", "developer", "viewer"),
      defaultValue: "developer",
    },
    invitedAt: { type: DataTypes.DATE },
    acceptedAt: { type: DataTypes.DATE },
  },
  { sequelize, modelName: "merchantUser", timestamps: true }
);
