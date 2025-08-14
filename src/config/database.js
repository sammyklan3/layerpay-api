import { Sequelize } from "sequelize";
import env from "./env.js";

const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: "postgres",
  logging: env.NODE_ENV === "development" ? console.log : false
});

export default sequelize;
