# Base Crypto Checkout Backend

A secure, scalable backend for accepting **USDC/ETH payments** on the **Base** blockchain.  
Built with **Node.js**, **Express**, **PostgreSQL**, **Sequelize**, and **ethers.js**.

---

## Features
- **Crypto Checkout** — Accept USDC or ETH directly into your wallet.
- **Base L2** — Low gas fees, fast confirmation times.
- **PostgreSQL + Sequelize** — Reliable order storage & easy querying.
- **Blockchain Listener** — Detects incoming payments in real-time.
- **.env Config** — Secure environment variables.
- **REST API** — Easy integration with your React/Vue/Next frontend.

---

## Tech Stack
- **Backend**: Node.js, Express
- **Database**: PostgreSQL + Sequelize ORM
- **Blockchain**: ethers.js (Base RPC)
- **Extras**: dotenv, uuid, morgan, cors

---

## Installation

```bash
# 1. Clone the repo
git clone https://github.com/sammyklan3/base-crypto-checkout-backend.git
cd base-crypto-checkout-backend

# 2. Install dependencies
npm install

# 3. Install Sequelize CLI globally (optional)
npm install -g sequelize-cli

# 4. Create and configure your database
createdb checkout_db

# 5. Copy environment variables
cp .env.example .env

# 6. Run migrations
npx sequelize-cli db:migrate

# 7. Start development server
npm run dev
