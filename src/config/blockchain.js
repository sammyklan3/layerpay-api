import { JsonRpcProvider, Contract } from "ethers";
import env from "./env.js";

const BASE_MAINNET = {
  chainId: 8453,
  name: "base",
};

const provider = new JsonRpcProvider(env.BASE_RPC_URL, BASE_MAINNET);

export const getProvider = () => provider;

export const getUSDCContract = () => {
  const USDC_ADDRESS = env.USDC_CONTRACT_ADDRESS;

  if (!USDC_ADDRESS) {
    throw new Error(
      "❌ USDC_CONTRACT_ADDRESS is not set in environment variables"
    );
  }

  const abi = [
    "event Transfer(address indexed from, address indexed to, uint256 value)",
  ];

  return new Contract(USDC_ADDRESS, abi, provider);
};
