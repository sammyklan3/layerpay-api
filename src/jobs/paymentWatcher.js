import { getUSDCContract, getProvider } from "../config/blockchain.js";
import { Transaction } from "../models/Transaction.js";

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

        const transaction = await Transaction.findOne({
          where: {
            merchantAddress: to_address.toLowerCase(),
            amount,
            status: "pending",
          },
        });

        if (transaction) {
          transaction.status = "paid";
          await transaction.save();
          console.log(`Transaction ${transaction.id} marked as paid`);
        }
      }

      lastBlock = currentBlock;
    } catch (err) {
      console.error("Payment watcher error:", err);
    }
  }, 15_000);
};
