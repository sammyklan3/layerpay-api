import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export class RefreshToken extends Model {}

RefreshToken.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    revoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    replacedByToken: {
      type: DataTypes.STRING, // rotating refresh tokens
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "refreshToken",
    timestamps: true,
  }
);
