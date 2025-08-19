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
    address: { type: DataTypes.STRING, allowNull: false, unique: true },
    type: { type: DataTypes.ENUM("hd", "scw", "external"), allowNull: false },
    asset: { type: DataTypes.ENUM("ETH", "USDC"), allowNull: false },
    derivationPath: { type: DataTypes.STRING },
    metadata: { type: DataTypes.JSONB },
  },
  { sequelize, modelName: "wallet", timestamps: true }
);
