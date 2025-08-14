import { User } from "./User.js";
import { ApiKey } from "./ApiKey.js";
import { Wallet } from "./Wallet.js";
import { PaymentIntent } from "./PaymentIntent.js";
import { Transaction } from "./Transaction.js";
import { Webhook } from "./Webhook.js";
import { WebhookEvent } from "./WebhookEvent.js";

User.hasMany(ApiKey, { foreignKey: "user_id" });
ApiKey.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Wallet, { foreignKey: "user_id" });
Wallet.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(PaymentIntent, { foreignKey: "user_id" });
PaymentIntent.belongsTo(User, { foreignKey: "user_id" });

ApiKey.hasMany(PaymentIntent, { foreignKey: "api_key_id" });
PaymentIntent.belongsTo(ApiKey, { foreignKey: "api_key_id" });

PaymentIntent.hasMany(Transaction, { foreignKey: "payment_intent_id" });
Transaction.belongsTo(PaymentIntent, { foreignKey: "payment_intent_id" });

User.hasMany(Webhook, { foreignKey: "user_id" });
Webhook.belongsTo(User, { foreignKey: "user_id" });

Webhook.hasMany(WebhookEvent, { foreignKey: "webhook_id" });
WebhookEvent.belongsTo(Webhook, { foreignKey: "webhook_id" });
