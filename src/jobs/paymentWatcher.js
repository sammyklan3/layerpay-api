import { getUSDCContract } from "../config/blockchain.js";
import { Order } from "../models/index.js";

export const startPaymentWatcher = () => {
  const usdc = getUSDCContract();

  usdc.on("Transfer", async (from, to, value, event) => {
    const amount = value.toString();
    const order = await Order.findOne({
      where: { merchantAddress: to.toLowerCase(), amount }
    });

    if (order && order.status === "pending") {
      order.status = "paid";
      await order.save();
      console.log(`Order ${order.id} marked as paid`);
    }
  });
};
