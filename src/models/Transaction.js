import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import e from "express";

export class Transaction extends Model {}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    txHash: { type: DataTypes.STRING, allowNull: false, unique: true },
    fromAddress: { type: DataTypes.STRING, allowNull: false },
    toAddress: { type: DataTypes.STRING, allowNull: false },
    asset: { type: DataTypes.ENUM("ETH", "USDC"), allowNull: false },
    amount: { type: DataTypes.DECIMAL, allowNull: false },
    blockNumber: { type: DataTypes.INTEGER },
    status: {
      type: DataTypes.ENUM("detected", "confirmed", "failed"),
      defaultValue: "detected",
    },
    confirmationCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    rawLog: { type: DataTypes.JSONB },
  },
  { sequelize, modelName: "transaction", timestamps: true }
);
