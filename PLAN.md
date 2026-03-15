# Plan: Deadline System Live

This plan outlines the implementation of a proactive compliance monitoring and notification system for the Chemical Safety Vault.

## 1. Frontend: Client-Side Deadline Checker (`client/src/hooks/useDeadlineChecker.ts`)

- **Logic**: 
    - Runs on application mount/initialization.
    - Scans the `compliance_deadlines` table for items where `status != 'Completed'`.
    - Identifies items that are **Overdue** (due date < now) or **Upcoming** (due date within next 7 days).
- **Triggers**:
    - Triggers whenever the `compliance_deadlines` table updates (via SpacetimeDB subscription).
- **Notifications**:
    - Uses the browser's **Notification API** for push alerts (PWA capability).
    - Uses **shadcn/ui Toast** for in-app visual alerts.

## 2. Backend: Reminder Logging (`spacetimedb/src/index.ts`)

- **Reducer**:
    - `logDeadlineReminder(deadline_id: u32, message: string)`:
        - A reducer to record that a reminder was issued to the shop.
        - Appends an entry to the `audit_logs` table.
        - Enforces multi-tenancy via `getShopId(ctx)`.

## 3. Production Readiness & Cron Jobs

- **Placeholder**: Add a comment in the backend code explaining the strategy for external triggers (e.g., using `cron-job.org` to hit a future `/api/check-deadlines` webhook).
- **Service Worker**: Ensure the `service-worker.js` is prepared to handle background notification events (even if simple for now).

## 4. Testing & Verification

- **Real-Time Alert Test**: Add a deadline due in 1 minute and verify the notification appears.
- **Overdue Highlight**: Verify that the UI correctly colors overdue items.
- **Audit Verification**: Confirm that sending a reminder creates an entry in the `audit_logs`.

## 5. Execution Steps

1. [ ] **Backend**: Implement the `logDeadlineReminder` reducer.
2. [ ] **Frontend**: Create the `useDeadlineChecker` hook.
3. [ ] **Frontend**: Implement Notification API permission request and alert logic.
4. [ ] **Frontend**: Integrate the checker into the root `App.tsx` or `AuthProvider`.
5. [ ] **Verification**: Manually test the notification flow and audit log generation.
6. [ ] **Commit**: `deadline system live`.
