import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export class Webhook extends Model {}

Webhook.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    url: { type: DataTypes.STRING, allowNull: false },
    secret: { type: DataTypes.STRING, allowNull: false },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { sequelize, modelName: "webhook", timestamps: true }
);
