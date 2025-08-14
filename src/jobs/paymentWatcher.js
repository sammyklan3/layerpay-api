import { getUSDCContract, getProvider } from "../config/blockchain.js";
import Order from "../models/Order.js";

export const startPaymentWatcher = async () => {
  const usdc = getUSDCContract();
  const provider = getProvider();

  let lastBlock = await provider.getBlockNumber();
  console.log(`Payment watcher started at block ${lastBlock}`);

  setInterval(async () => {
    try {
      const currentBlock = await provider.getBlockNumber();

      const logs = await usdc.queryFilter(
        usdc.filters.Transfer(),
        lastBlock + 1,
        currentBlock
      );

      for (const log of logs) {
        const { from, to, value } = log.args;
        const amount = value.toString();

        const order = await Order.findOne({
          where: {
            merchantAddress: to.toLowerCase(),
            amount,
            status: "pending",
          },
        });

        if (order) {
          order.status = "paid";
          await order.save();
          console.log(`Order ${order.id} marked as paid`);
        }
      }

      lastBlock = currentBlock;
    } catch (err) {
      console.error("Payment watcher error:", err);
    }
  }, 15_000);
};
