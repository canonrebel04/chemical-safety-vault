# TODO: Chemical Safety Vault Audit Generation

- [x] **1. Backend: Enhanced Audit Logic** `[backend]` `[database]`
  - [x] Refactor `generateSafetyAudit` reducer in `spacetimedb/src/index.ts`:
    - [x] Add logic to compile full shop state (Inventory, Spills, Deadlines).
    - [x] Implement automatic insertion of audit JSON snapshot into `audit_logs` table with action type `FULL_SAFETY_AUDIT`.
- [x] **2. Frontend: Export Library Setup** `[frontend]` `[parallel]`
  - [x] Install dependencies: `npm install jspdf jspdf-autotable` in `client/`.
  - [x] Create a utility helper `client/src/lib/pdf-generator.ts` for OSHA report formatting.
- [x] **3. Frontend: Export for OSHA UI** `[frontend]`
  - [x] Update `client/src/pages/Audits.tsx`:
    - [x] Add "Export for OSHA" button.
    - [x] Implement logic to trigger `generateSafetyAudit` and then process the data into a PDF.
    - [x] Add a loading/processing state for the export action.

- [x] **4. Verification & Finalization** `[test]`
  - [x] Regenerate client bindings: `npm run spacetime:generate`.
  - [x] Verify that the audit snapshot is correctly stored in the `audit_logs` table.
  - [x] Perform an end-to-end test: Generate audit -> Download PDF -> Verify content.
  - [x] Run production build: `npm run build`.
  - [x] Commit changes with message: `audit generation complete`.
