import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    amountUsd: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    amountCrypto: {
      type: DataTypes.STRING,
      allowNull: false
    },
    currency: {
      type: DataTypes.ENUM("USDC", "ETH"),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("pending", "paid", "expired", "failed"),
      defaultValue: "pending"
    },
    paymentAddress: {
      type: DataTypes.STRING,
      allowNull: false
    },
    txHash: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: "orders",
    timestamps: true
  }
);

export default Order;
