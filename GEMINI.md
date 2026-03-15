# Chemical Safety Vault - Project Instructions

This project is a mobile-first Progressive Web App (PWA) built with **React** and **SpacetimeDB**, designed for auto-parts and small blender shops to manage chemical safety logs and compliance.

## Project Overview

- **Backend (`spacetimedb/`)**: A SpacetimeDB TypeScript module defining the database schema and reducers.
  - **Schema**: Includes `shops`, `chemical_inventory`, `sds_documents`, `spill_reports`, `compliance_deadlines`, and `audit_logs`.
  - **Multi-tenancy**: Enforced by an `Identity`-based `shop_id` on every row. Reducers use `ctx.sender` to ensure data isolation.
- **Frontend (`client/`)**: A React + Vite application optimized for mobile.
  - **Tech Stack**: Tailwind CSS, shadcn/ui, Lucide Icons, React Hook Form, Zod, and SpacetimeDB React SDK.
  - **PWA**: Configured with `manifest.json` and a service worker for offline caching of forms.
  - **Real-time**: Subscribes to all relevant tables on connection for instant updates across devices.

## Building and Running

### Prerequisites
- [SpacetimeDB CLI](https://spacetimedb.com/docs/getting-started/installation)
- Node.js (v18+)

### Development Workflow
1.  **Start SpacetimeDB Local Server**:
    ```bash
    spacetime start
    ```
2.  **Publish Backend Module**:
    ```bash
    cd spacetimedb
    npm install
    npm run build
    spacetime publish --module-path . --server local chemical-safety-vault
    ```
3.  **Generate Client Bindings**:
    ```bash
    cd client
    npm run spacetime:generate
    ```
4.  **Run Frontend**:
    ```bash
    cd client
    npm install
    npm run dev
    ```

### Production Build
- **Frontend**: `cd client && npm run build`
- **Backend**: `cd spacetimedb && npm run build`

## Development Conventions

- **Schema Diagram**:
  ```text
  shops (PK: id [Identity])
    |
    +-- chemical_inventory (FK: shop_id, PK: id [u32 autoInc])
    |     |
    |     +-- sds_documents (FK: shop_id, chemical_id, PK: id [u32 autoInc])
    |     +-- spill_reports (FK: shop_id, chemical_id, PK: id [u32 autoInc])
    |
    +-- compliance_deadlines (FK: shop_id, PK: id [u32 autoInc])
    +-- audit_logs (FK: shop_id, PK: id [u32 autoInc])
  ```
- **Row-Level Security**: Every data-modifying reducer MUST verify that the `shop_id` matches `ctx.sender`.
- **Form Validation**: Use `zod` schemas with `react-hook-form` for all UI inputs.
- **UI Style**: Follow the mobile-first approach with bottom navigation and dark mode by default.
- **Real-time Sync**: Always use `useTable` and `useReducer` from `spacetimedb/react` for reactive state management.

## Key Files
- `spacetimedb/src/index.ts`: The source of truth for the database schema and business logic.
- `client/src/main.tsx`: Handles SpacetimeDB connection and global table subscriptions.
- `client/src/App.tsx`: Main routing and layout configuration.
- `client/src/pages/`: Contains functional views (Dashboard, Inventory, SDS, Spills, Deadlines, Audits).
- `client/src/module_bindings/`: Auto-generated bindings for interacting with the backend.
