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

### What makes it unique?
Unlike generic logbooks, this vault is built on a "multiplayer" database engine (SpacetimeDB), allowing instant updates across all devices in the shop without traditional REST API overhead.

---

## 🗺️ Table of Contents
1. [Installation](#-installation)
2. [Quick Start](#-quick-start)
3. [Folder Structure](#-folder-structure)
4. [Configuration](#-configuration)
5. [Development](#-development)
6. [Testing](#-testing)
7. [Roadmap](#-roadmap)
8. [License](#-license)

---

## ⚙️ Installation

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

2. **Install Frontend Dependencies:**
   ```bash
   cd client
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd ../spacetimedb
   npm install
   ```

---

## 🚀 Quick Start

To launch the development environment:

1. **Start SpacetimeDB Backend:**
   ```bash
   # From the project root
   spacetime dev --module-path spacetimedb
   ```

2. **Launch React Frontend:**
   ```bash
   cd client
   npm run dev
   ```

3. **Verify:**
   Open `http://localhost:5173` in your browser. You should see the landing page. Click **"Launch App"** to enter the dashboard.

---

## 📂 Folder Structure

```text
.
├── client/                     # React + Vite (Frontend)
│   ├── public/                 # PWA Manifest & Assets
│   ├── src/                    # UI & Logic
│   │   ├── components/ui/      # shadcn/ui components
│   │   ├── lib/utils.ts        # Tailwind utility functions
│   │   ├── App.tsx             # Main routing & UI
│   │   └── main.tsx            # PWA registration
│   ├── tailwind.config.js      # Tailwind configuration
│   └── vite.config.ts          # Vite/TypeScript setup
├── spacetimedb/                # SpacetimeDB Module (Backend)
│   └── src/index.ts            # Tables and Reducers definition
└── spacetime.json              # Global project configuration
```

---

## 🛠️ Configuration

### Environment Variables
Create a `client/.env.local` file (automatically generated during init):
- `VITE_SPACETIMEDB_HOST`: URL of your SpacetimeDB instance (default: `ws://localhost:3000`)
- `VITE_SPACETIMEDB_DB_NAME`: The name of your database.

---

## 💻 Development

### Key Tech Stack
- **Frontend**: React (TypeScript), Vite, Tailwind CSS, shadcn/ui.
- **State Management**: Zustand, SpacetimeDB React hooks.
- **Backend**: SpacetimeDB (TypeScript module).
- **PWA**: Custom Service Worker and Web Manifest.

### Build the Project
```bash
# Frontend
cd client && npm run build

# Backend
cd spacetimedb && npm run build
```

---

## 🧪 Testing

The project includes a verification suite to ensure scaffold integrity.

### Run Tests
```bash
# Check client build and dependencies
cd client && npm run build

# Check backend build
cd spacetimedb && npm run build
```
*A detailed test plan is maintained in `TEST.md`.*

---

## 🛣️ Roadmap
- [ ] **SDS Scanner**: Upload and parse Safety Data Sheets automatically.
- [ ] **Inventory Integration**: Track chemical levels and auto-order replacements.
- [ ] **Team Roles**: Permission-based access for shop managers and technicians.
- [ ] **Export Reports**: Generate OSHA-compliant safety reports in PDF/CSV.

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ⚖️ License

Distributed under the **ISC License**. See `client/LICENSE` for more information.

---

## 📬 Support & Contact

- **Issue Tracker**: [GitHub Issues](https://github.com/yourusername/chemical-safety-vault/issues)
- **Support**: Reach out via the issue tracker for bugs or feature requests.

---

*Built with ❤️ for the workshop community using SpacetimeDB.*
