# TODO: Chemical Safety Vault Mobile-First UI

- [x] **1. UI Foundation & Theme Setup** `[frontend]`
  - [x] Set default theme to dark mode in `client/tailwind.config.js` and `client/src/index.css`.
  - [x] Update `client/index.html` body background to match dark mode.
  - [x] Create a Layout component (`client/src/components/Layout.tsx`) to wrap all pages.
  - [x] Implement a mobile-first, fixed Bottom Navigation bar in the Layout using `lucide-react` icons.

- [x] **2. Core Components & Shadcn Configuration** `[frontend]` `[parallel]`
  - [x] Install missing shadcn/ui components: `npx shadcn@latest add card input form label table table badge dialog` (or similar needed components).
  - [x] Ensure `react-hook-form` and `@hookform/resolvers/zod` are installed and ready.

- [x] **3. SpacetimeDB Integration** `[frontend]`
  - [x] Update `client/src/main.tsx` or create a centralized hook to subscribe to all relevant tables (`shops`, `chemical_inventory`, `sds_documents`, `spill_reports`, `compliance_deadlines`, `audit_logs`) on connect.

- [x] **4. Dashboard View (`/dashboard`)** `[frontend]`
  - [x] Create `client/src/pages/Dashboard.tsx`.
  - [x] Implement live inventory summary using `useChemicalInventoryTable`.
  - [x] Implement quick metrics cards (total items, active deadlines, recent spills).

- [x] **5. Inventory View (`/inventory`)** `[frontend]`
  - [x] Create `client/src/pages/Inventory.tsx`.
  - [x] Build the list view of current chemicals.
  - [x] Create an "Add Item" form modal/dialog using `zod` schema (CAS, Name, Qty, Unit, Location).
  - [x] Connect the form to `addInventoryItem` reducer.
  - [x] Add a visual "Scan Barcode" placeholder button.

- [x] **6. SDS Management View (`/sds`)** `[frontend]`
  - [x] Create `client/src/pages/SDS.tsx`.
  - [x] Implement a drag-and-drop or standard file upload UI placeholder.
  - [x] Create a form to link the uploaded file to a `chemical_id`.
  - [x] Connect to `uploadSDS` reducer (mocking the S3 URL for now).

- [x] **7. Spill Logs View (`/spills`)** `[frontend]`
  - [x] Create `client/src/pages/Spills.tsx`.
  - [x] Display a list of recorded spills using `useSpillReportsTable`.
  - [x] Create "Log Spill" form (Chemical ID, Amount, Description, Actions, Witnesses) connected to `logSpill` reducer.

- [x] **8. Compliance Deadlines View (`/deadlines`)** `[frontend]`
  - [x] Create `client/src/pages/Deadlines.tsx`.
  - [x] Display deadlines in a chronological list, highlighting overdue ones in red/warning colors.
  - [x] Create "Add Deadline" form (Type, Description, Date) connected to `createDeadline` reducer.

- [x] **9. Audits View (`/audits`)** `[frontend]`
  - [x] Create `client/src/pages/Audits.tsx`.
  - [x] Implement "Generate Safety Audit" button triggering the `generateSafetyAudit` reducer.
  - [x] Implement logic to display or download the resulting JSON (since reducers don't return data directly to the caller, we might need to display audit logs or just trigger the action).

- [x] **10. Finalization** `[frontend]`
  - [x] Update routing in `client/src/App.tsx` to include the Layout and all new pages.
  - [x] Run `npm run build` to ensure no TypeScript or Vite compilation errors.
  - [x] Commit all changes with message: `mobile-first UI complete`.
