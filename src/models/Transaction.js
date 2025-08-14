import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export class Transaction extends Model {}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tx_hash: DataTypes.STRING,
    from_address: DataTypes.STRING,
    to_address: DataTypes.STRING,
    amount: DataTypes.DECIMAL(36, 18),
    currency: DataTypes.ENUM("ETH", "USDC"),
    confirmations: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "failed"),
      defaultValue: "pending",
    },
    block_number: DataTypes.INTEGER,
  },
  { sequelize, modelName: "transaction", timestamps: true }
);
