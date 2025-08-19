import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export class WebhookEvent extends Model {}

WebhookEvent.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    eventType: {
      type: DataTypes.ENUM(
        "checkout.created",
        "payment.detected",
        "payment.confirmed",
        "payment.failed",
        "session.expired",
        "refund.created",
        "payout.created"
      ),
      allowNull: false,
    },
    payload: { type: DataTypes.JSONB, allowNull: false },
    attempts: { type: DataTypes.INTEGER, defaultValue: 0 },
    lastAttemptAt: { type: DataTypes.DATE },
    nextAttemptAt: { type: DataTypes.DATE },
    status: {
      type: DataTypes.ENUM("queued", "delivered", "failed"),
      defaultValue: "queued",
    },
  },
  { sequelize, modelName: "webhookEvent", timestamps: true }
);
