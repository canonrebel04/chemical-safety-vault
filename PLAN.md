# Plan: Chemical Safety Vault Schema Expansion

This plan outlines the steps to define the core database schema for the Chemical Safety Vault, implementing multi-tenancy and safety-focused reducers.

## 1. Schema Definition (`spacetimedb/src/index.ts`)

Define the following tables with appropriate types and indexes:

- **shops**: `id: Identity` (PK), `name: string`, `owner: Identity` (Unique Index).
- **chemical_inventory**: `id: number` (Autoinc PK), `shop_id: Identity`, `cas_number: string`, `name: string`, `quantity: number`, `unit: string`, `location: string`, `last_updated: number` (Index: `shop_id`).
- **sds_documents**: `id: number` (Autoinc PK), `shop_id: Identity`, `chemical_id: number`, `filename: string`, `s3_url: string`, `expiry_date: number` (Index: `shop_id`, `chemical_id`).
- **spill_reports**: `id: number` (Autoinc PK), `shop_id: Identity`, `chemical_id: number`, `date: number`, `amount_spilled: number`, `description: string`, `actions_taken: string`, `witnesses: string` (Index: `shop_id`).
- **compliance_deadlines**: `id: number` (Autoinc PK), `shop_id: Identity`, `type: string` (OSHA/EPA/etc.), `description: string`, `due_date: number`, `status: string` (Index: `shop_id`).
- **audit_logs**: `id: number` (Autoinc PK), `shop_id: Identity`, `action: string`, `user: Identity`, `timestamp: number`, `details: string` (Index: `shop_id`).

## 2. Multi-Tenancy and Row-Level Security

- **Ownership**: The `shop_id` (or `owner` in the `shops` table) will store the `Identity` of the user who owns the shop.
- **Enforcement**: 
    - Read filters: The frontend will only subscribe to data where `shop_id == ctx.sender` (enforced via server-side subscription filters if applicable, or logic in reducers).
    - Write validation: Every reducer will check if the record's `shop_id` matches the `ctx.sender`.

## 3. Reducers Implementation

Implement the following logic:

- **createShop(name: string)**: Creates a entry in `shops` for the current `ctx.sender`.
- **addInventoryItem(...)**: Adds a chemical to the current shop.
- **updateQuantity(chemical_id: number, new_quantity: number)**: Updates stock levels.
- **uploadSDS(chemical_id: number, filename: string, s3_url: string, expiry_date: number)**: Links an SDS document. *Note: Presigned URL logic is typically client-side, the reducer stores the metadata.*
- **logSpill(...)**: Records a safety incident.
- **createDeadline(...)**: Schedules compliance tasks.
- **generateSafetyAudit()**: A reducer (or query logic) that aggregates data from the last 30 days into a structured JSON for reporting.

## 4. Execution Steps

1. [ ] **Research & Update Schema**: Implement table definitions and `audit_logs` helper.
2. [ ] **Implement Reducers**: Write the logic for shop management and safety logs.
3. [ ] **Binding Regeneration**: Run binding generation to update the React client.
4. [ ] **Verification**: Run `npm run build` in `spacetimedb` and ensure the client compiles.
5. [ ] **Commit**: Final commit with a schema diagram in the message.

## Questions/Clarifications

- **ID Generation**: Should we use `t.identity()` for `shop_id` and auto-increment for other IDs? (Assuming Yes).
- **Audit Logs**: Should every action be logged automatically within the reducers? (Assuming Yes).
