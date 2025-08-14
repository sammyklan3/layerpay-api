import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export class Wallet extends Model {}

Wallet.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    address: DataTypes.STRING,
    type: {
      type: DataTypes.ENUM("deposit", "payout"),
      defaultValue: "deposit",
    },
    chain: DataTypes.STRING,
  },
  { sequelize, modelName: "wallet", timestamps: true }
);
