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

// Explicit join table relations
Merchant.hasMany(MerchantUser, { foreignKey: "merchantId" });
MerchantUser.belongsTo(Merchant, { foreignKey: "merchantId" });

User.hasMany(MerchantUser, { foreignKey: "userId" });
MerchantUser.belongsTo(User, { foreignKey: "userId" });

Merchant.hasMany(ApiKey);
ApiKey.belongsTo(Merchant);
Merchant.hasMany(Wallet);
Wallet.belongsTo(Merchant);
Merchant.hasMany(Webhook);
Webhook.belongsTo(Merchant);
Merchant.hasMany(PaymentIntent);
PaymentIntent.belongsTo(Merchant);
Merchant.hasMany(Payout);
Payout.belongsTo(Merchant);

PaymentIntent.hasMany(Transaction);
Transaction.belongsTo(PaymentIntent);
PaymentIntent.hasMany(Refund);
Refund.belongsTo(PaymentIntent);

Transaction.belongsTo(Wallet);

Webhook.hasMany(WebhookEvent);
WebhookEvent.belongsTo(Webhook);

Refund.belongsTo(Transaction, { foreignKey: "transactionId" });
Payout.belongsTo(Transaction, { foreignKey: "transactionId", allowNull: true });
