# Plan: Audit Generation Complete

This plan outlines the enhancement of the safety audit system to provide professional, OSHA-compliant PDF reports generated from real-time shop data.

## 1. Backend: Enhanced Audit Reducer (`spacetimedb/src/index.ts`)

- **Logic Refinement**: 
    - Update `generateSafetyAudit` to return (via console/log or a temporary audit table if needed) a comprehensive shop state.
    - Fields to include: 
        - Shop Info (Name, Owner).
        - Full Chemical Inventory (Name, CAS, Qty, Unit, Location).
        - Spill Incidents (Last 30-90 days).
        - Compliance Deadlines (Upcoming and Overdue).
- **Audit Persistence**:
    - Every time a report is generated, store a full JSON snapshot of the audit in the `audit_logs` table with action type `FULL_SAFETY_AUDIT`.

## 2. Frontend: PDF Generation & Export (`client/src/pages/Audits.tsx`)

- **Dependencies**: 
    - Install `jspdf` and `jspdf-autotable` for professional document formatting.
- **Components**:
    - **Export Logic**: A utility function `generateOSHAReport(data)` that takes the JSON audit data and maps it to a PDF layout.
    - **Report Header**: Includes "Chemical Safety Log Vault", Shop Name, and Date generated.
    - **Tables**: Cleanly formatted tables for Inventory, Spills, and Compliance.
- **UI Integration**:
    - Update the `/audits` page with a prominent "Export for OSHA" button.
    - Show a loading spinner during PDF generation.

## 3. Storage & Compliance

- **Immutable Logs**: Ensure the `audit_logs` entry cannot be modified, serving as a historical record of what was exported.
- **Local Download**: The PDF is generated client-side and downloaded directly, minimizing server load.

## 4. Testing & Verification

- **Data Integrity**: Verify that the JSON snapshot in `audit_logs` matches the data presented in the downloaded PDF.
- **Layout Test**: Open the generated PDF and ensure all tables are readable and correctly titled.
- **Multi-Tenancy**: Verify that User A cannot generate an audit for Shop B.

## 5. Execution Steps

1. [ ] **Backend**: Enhance `generateSafetyAudit` to compile full data and log to `audit_logs`.
2. [ ] **Frontend**: Install `jspdf` and `jspdf-autotable`.
3. [ ] **Frontend**: Implement the PDF mapping logic.
4. [ ] **Frontend**: Update the `Audits` page with the new export button.
5. [ ] **Verification**: Generate an audit, download the PDF, and check the `audit_logs`.
6. [ ] **Commit**: `audit_generation_complete`.
