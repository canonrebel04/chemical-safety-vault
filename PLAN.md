# Plan: Chemical Safety Vault Mobile-First UI

This plan details the implementation of a mobile-first Progressive Web App (PWA) client for the Chemical Safety Vault using React, Tailwind CSS, shadcn/ui, and SpacetimeDB real-time subscriptions.

## 1. Project Setup & Architecture
- **Theme**: Set dark mode as the default in `tailwind.config.js` and `index.css`.
- **Navigation**: Implement a mobile-first, React Native-style bottom navigation bar connecting the core views.
- **Form Handling**: Integrate `react-hook-form` and `zod` for strict, type-safe form validation across all inputs.
- **SpacetimeDB Integration**: Ensure the root component subscribes to all relevant tables (`shops`, `chemical_inventory`, `sds_documents`, `spill_reports`, `compliance_deadlines`, `audit_logs`) so data updates instantly across devices.

## 2. Core Pages Implementation

### 2.1 Dashboard (`/dashboard`)
- **Purpose**: Real-time overview of the shop's status.
- **Components**:
    - Live inventory summary table.
    - Quick metrics (total chemicals, recent spills, upcoming deadlines).
    - Utilizes SpacetimeDB React hooks (`useChemicalInventoryTable`, etc.) for reactive updates.

### 2.2 Inventory (`/inventory`)
- **Purpose**: Manage chemical stock.
- **Components**:
    - List view of all chemicals.
    - "Add Item" floating action button (FAB) or prominent top button.
    - Add/Edit Item Form (using `react-hook-form` + `zod`):
        - Fields: CAS Number, Name, Quantity, Unit, Location.
    - *Placeholder*: A UI button indicating "Scan Barcode" (action doesn't need native device integration yet, just the UI layout).

### 2.3 SDS Management (`/sds`)
- **Purpose**: Safety Data Sheet uploads and links.
- **Components**:
    - Drag-and-drop file upload zone.
    - Form to link the file to a specific `chemical_id`.
    - Connection to the `uploadSDS` reducer.
    - *Note*: Mock the S3 presigned URL generation client-side or use a placeholder URL for the MVP, focusing on calling the reducer correctly.

### 2.4 Spill Logs (`/spills`)
- **Purpose**: Reporting safety incidents.
- **Components**:
    - List of recent spills.
    - "Log Spill" Form (`react-hook-form` + `zod`):
        - Fields: Chemical (dropdown), Amount Spilled, Description, Actions Taken, Witnesses.

### 2.5 Compliance Deadlines (`/deadlines`)
- **Purpose**: Tracking OSHA/EPA dates.
- **Components**:
    - Calendar or chronological list view.
    - Highlighting/Color-coding for overdue or upcoming deadlines.
    - "Add Deadline" Form.

### 2.6 Audits (`/audits`)
- **Purpose**: Generate compliance reports.
- **Components**:
    - "Generate Safety Audit" button (calls the `generateSafetyAudit` reducer).
    - Display the generated JSON report.
    - "Download Report" button (converts JSON to a downloadable file).

## 3. UI/UX Details
- Utilize `shadcn/ui` components (Cards, Inputs, Buttons, Forms, Tables).
- Ensure padding, touch targets, and typography are optimized for mobile devices (min 44px touch targets).

## 4. Execution Steps
1. [ ] Configure Dark Mode and core Layout (Bottom Nav).
2. [ ] Set up SpacetimeDB global subscriptions.
3. [ ] Build Dashboard and Inventory pages (with forms).
4. [ ] Build SDS, Spills, and Deadlines pages.
5. [ ] Build Audits page and download logic.
6. [ ] Verify PWA responsiveness and real-time sync.
7. [ ] Final Commit: `mobile-first UI complete`.
