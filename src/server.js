import http from "http";
import app from "./app.js";
import env from "./config/env.js";
import { sequelize } from "./config/database.js";
import { startPaymentWatcher } from "./jobs/paymentWatcher.js";

const PORT = env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // Start blockchain payment watcher
    startPaymentWatcher();
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
})();
