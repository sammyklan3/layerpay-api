import { User } from "./User.js";
import { ApiKey } from "./ApiKey.js";
import { Wallet } from "./Wallet.js";
import { PaymentIntent } from "./PaymentIntent.js";
import { Transaction } from "./Transaction.js";
import { Webhook } from "./Webhook.js";
import { WebhookEvent } from "./WebhookEvent.js";
import { Merchant } from "./Merchant.js";
import { MerchantUser } from "./MerchantUser.js";
import { Refund } from "./Refund.js";
import { Payout } from "./Payout.js";

export function setupAssociations() {
  // -------------------- USER <-> MERCHANT (Many-to-Many) --------------------
  User.belongsToMany(Merchant, { through: MerchantUser, foreignKey: "userId" });
  Merchant.belongsToMany(User, {
    through: MerchantUser,
    foreignKey: "merchantId",
  });

  // Explicit join table relations
  Merchant.hasMany(MerchantUser, { foreignKey: "merchantId" });
  MerchantUser.belongsTo(Merchant, { foreignKey: "merchantId" });

  User.hasMany(MerchantUser, { foreignKey: "userId" });
  MerchantUser.belongsTo(User, { foreignKey: "userId" });

  // -------------------- MERCHANT OWNED RESOURCES --------------------
  Merchant.hasMany(ApiKey, { foreignKey: "merchantId" });
  ApiKey.belongsTo(Merchant, { foreignKey: "merchantId" });

  Merchant.hasMany(Wallet, { foreignKey: "merchantId" });
  Wallet.belongsTo(Merchant, { foreignKey: "merchantId" });

  Merchant.hasMany(Webhook, { foreignKey: "merchantId" });
  Webhook.belongsTo(Merchant, { foreignKey: "merchantId" });

  Merchant.hasMany(PaymentIntent, { foreignKey: "merchantId" });
  PaymentIntent.belongsTo(Merchant, { foreignKey: "merchantId" });

  Merchant.hasMany(Payout, { foreignKey: "merchantId" });
  Payout.belongsTo(Merchant, { foreignKey: "merchantId" });

  // -------------------- PAYMENT FLOWS --------------------
  PaymentIntent.hasMany(Transaction, { foreignKey: "paymentIntentId" });
  Transaction.belongsTo(PaymentIntent, { foreignKey: "paymentIntentId" });

  PaymentIntent.hasMany(Refund, { foreignKey: "paymentIntentId" });
  Refund.belongsTo(PaymentIntent, { foreignKey: "paymentIntentId" });

  Transaction.belongsTo(Wallet, { foreignKey: "walletId" });

  // -------------------- REFUNDS & PAYOUTS --------------------
  Refund.belongsTo(Transaction, { foreignKey: "transactionId" });
  Payout.belongsTo(Transaction, {
    foreignKey: "transactionId",
    allowNull: true,
  });

  // -------------------- WEBHOOKS --------------------
  Webhook.hasMany(WebhookEvent, { foreignKey: "webhookId" });
  WebhookEvent.belongsTo(Webhook, { foreignKey: "webhookId" });
}
