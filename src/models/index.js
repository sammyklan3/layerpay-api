import sequelize from "../config/database.js";
import { setupAssociations } from "./associations.js";

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
import { RefreshToken } from "./RefreshToken.js";

setupAssociations();

const db = {
  sequelize,
  User,
  ApiKey,
  Wallet,
  PaymentIntent,
  Transaction,
  Webhook,
  WebhookEvent,
  Merchant,
  MerchantUser,
  RefreshToken,
  Refund,
  Payout,
};

export default db;
