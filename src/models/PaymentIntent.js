import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

export class PaymentIntent extends Model {}

PaymentIntent.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    amount: DataTypes.DECIMAL(36, 18),
    currency: DataTypes.ENUM("ETH", "USDC"),
    deposit_address: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "failed", "expired"),
      defaultValue: "pending",
    },
    expires_at: DataTypes.DATE,
    metadata: DataTypes.JSONB,
  },
  { sequelize, modelName: "payment_intent", timestamps: true }
);
