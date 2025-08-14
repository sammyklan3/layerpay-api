import dotenv from "dotenv";

dotenv.config();

const requiredVars = [
  "PORT",
  "NODE_ENV",
  "CLIENT_URL",
  "BASE_RPC_URL",
  "MERCHANT_ADDRESS",
  "DATABASE_URL",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "USDC_CONTRACT_ADDRESS",
];

// Check for missing required env vars
requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

export default {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  CLIENT_URL: process.env.CLIENT_URL,
  BASE_RPC_URL: process.env.BASE_RPC_URL,
  MERCHANT_ADDRESS: process.env.MERCHANT_ADDRESS.toLowerCase(),
  DATABASE_URL: process.env.DATABASE_URL,
  USDC_CONTRACT_ADDRESS: process.env.USDC_CONTRACT_ADDRESS,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
};
