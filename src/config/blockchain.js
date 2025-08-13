import { ethers } from "ethers";
import env from "./env.js";

const provider = new ethers.JsonRpcApiProvider(env.BASE_RPC_URL);

export const getProvider = () => provider;

export const getUSDCContract = () => {
    const USDC_ADDRESS = env.USDC_ADDRESS;
    const abi = [
    "event Transfer(address indexed from, address indexed to, uint256 value)"
  ];
    return new ethers.Contract(USDC_ADDRESS, abi, provider);
}