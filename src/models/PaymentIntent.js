import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export class PaymentIntent extends Model {}

PaymentIntent.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    amountFiat: { type: DataTypes.DECIMAL, allowNull: false },
    fiatCurrency: { type: DataTypes.STRING, allowNull: false },
    amountCrypto: { type: DataTypes.DECIMAL, allowNull: false },
    cryptoCurrency: { type: DataTypes.ENUM("ETH", "USDC"), allowNull: false },
    chain: { type: DataTypes.ENUM("base"), defaultValue: "base" },
    status: {
      type: DataTypes.ENUM(
        "created",
        "pending",
        "paid",
        "underpaid",
        "overpaid",
        "expired",
        "canceled",
        "refunded"
      ),
      defaultValue: "created",
    },
    expiresAt: { type: DataTypes.DATE },
    pricingLockedAt: { type: DataTypes.DATE },
    pricingTtlSeconds: { type: DataTypes.INTEGER },
    metadata: { type: DataTypes.JSONB },
    idempotencyKey: { type: DataTypes.STRING, unique: true },
  },
  { sequelize, modelName: "paymentIntent", timestamps: true }
);
