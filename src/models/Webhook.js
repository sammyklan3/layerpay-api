import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

export class Webhook extends Model {}

Webhook.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    url: DataTypes.STRING,
    secret: DataTypes.STRING,
  },
  { sequelize, modelName: "webhook", timestamps: true }
);
