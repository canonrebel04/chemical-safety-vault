# 🧪 Chemical Safety Vault

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Framework: React](https://img.shields.io/badge/Framework-React-blue.svg)](https://reactjs.org/)
[![Database: SpacetimeDB](https://img.shields.io/badge/Database-SpacetimeDB-orange.svg)](https://spacetimedb.com/)
[![PWA: Ready](https://img.shields.io/badge/PWA-Ready-green.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

**Chemical Safety Log Vault** is a high-performance, offline-first application designed specifically for **auto-parts & small blender shops** to securely log, track, and manage chemical safety data.

---

## 📖 Description

Managing chemical safety data in a fast-paced workshop environment is critical yet often cumbersome. **Chemical Safety Vault** solves this by providing a robust, Progressive Web App (PWA) that works seamlessly on any device, even when the shop's Wi-Fi fails.

### Key Features
- 🚀 **Lightning Fast**: Built on **SpacetimeDB**, offering real-time synchronization and a high-performance backend.
- 📶 **Offline-First (PWA)**: Full offline caching for forms and logs—essential for environments with spotty connectivity.
- 🛡️ **Workshop Optimized**: Streamlined UI for auto-parts and small blender shops using **Tailwind CSS** and **shadcn/ui**.
- 🔐 **Secure Logs**: Immutable database logs ensure safety compliance and audit readiness.
- 💰 **Built-in Billing**: Integrated Stripe checkout for premium features.

---

## ⚙️ Installation & Development

### Prerequisites
- [SpacetimeDB CLI](https://spacetimedb.com/docs/getting-started/installation)
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)

### Step-by-Step Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/chemical-safety-vault.git
   cd chemical-safety-vault
   ```

2. **Install Dependencies:**
   ```bash
   cd client && npm install
   cd ../spacetimedb && npm install
   ```

3. **Run Locally:**
   ```bash
   # From project root, start SpacetimeDB
   spacetime dev --module-path spacetimedb
   
   # In another terminal, start React
   cd client && npm run dev
   ```

---

## 🚀 Deployment

To deploy to SpacetimeDB Maincloud:

1. **Publish Backend:**
   ```bash
   spacetime publish --server maincloud chemical-safety-vault --module-path spacetimedb
   ```

2. **Generate Bindings:**
   ```bash
   cd client && npm run spacetime:generate
   ```

3. **Deploy Frontend:**
   Upload the `client/dist` folder to your static hosting provider (e.g., Netlify, Vercel, or AWS S3 + CloudFront).

---

## 🛠️ Configuration

### Environment Variables
Create a `client/.env.local` file:
- `VITE_SPACETIMEDB_HOST`: URL of your SpacetimeDB instance (e.g., `wss://maincloud.spacetimedb.com`)
- `VITE_SPACETIMEDB_DB_NAME`: `chemical-safety-vault`
- `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe Test/Live key.
- `VITE_S3_PUBLIC_URL`: Base URL for SDS document access.

---

## 📦 Data Portability & Compliance

Chemical Safety Vault prioritizes data ownership. All shop data can be exported at any time from the **Audits** page:
- **OSHA Reports**: Professional PDF summaries of the last 30 days.
- **CSV Exports**: Raw data for Inventory, Spills, and Deadlines.
- **Full Vault (JSON)**: Complete data dump for compliance audits.

---

## ⚖️ License

Distributed under the **ISC License**.

---

*Built with ❤️ for the workshop community using SpacetimeDB.*
