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
    event_type: DataTypes.STRING,
    payload: DataTypes.JSONB,
    status: {
      type: DataTypes.ENUM("pending", "delivered", "failed"),
      defaultValue: "pending",
    },
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    last_attempt_at: DataTypes.DATE,
  },
  { sequelize, modelName: "webhook_event", timestamps: true }
);
