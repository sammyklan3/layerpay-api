import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export class Refund extends Model {}

Refund.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    amount: { type: DataTypes.DECIMAL, allowNull: false },
    asset: { type: DataTypes.ENUM("ETH", "USDC"), allowNull: false },
    toAddress: { type: DataTypes.STRING, allowNull: false },
    txHash: { type: DataTypes.STRING },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      defaultValue: "pending",
    },
  },
  { sequelize, modelName: "refund", timestamps: true }
);
