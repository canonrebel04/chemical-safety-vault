# Plan: Stripe Billing Wired

This plan outlines the integration of Stripe payments into the Chemical Safety Vault to support a $59/mo premium plan with unlimited features.

## 1. Backend: Subscription Schema & Logic (`spacetimedb/src/index.ts`)

- **Schema Update**: 
    - Modify the `shops` table to include:
        - `plan: string` (default: "free")
        - `stripe_subscription_id: string?` (optional)
- **Reducer**:
    - `createSubscription(subscription_id: string)`:
        - Associates the provided `subscription_id` with the user's shop.
        - Updates the `plan` field to "premium".
        - Enforces multi-tenancy via `getShopId(ctx)`.
        - Logs the upgrade event in `audit_logs`.

## 2. Frontend: Stripe Integration & Billing Page (`client/`)

- **Dependencies**: 
    - Install `@stripe/stripe-js`.
- **Billing Page (`client/src/pages/Billing.tsx`)**:
    - Display current plan status.
    - Show "Upgrade to Premium" button ($59/mo).
    - Features: Unlimited Inventory, Custom SDS Storage, Priority Compliance Alerts.
- **Stripe Checkout Flow**:
    - **Trigger**: Clicking "Upgrade" redirects the user to a Stripe Checkout Session.
    - **Return**: After successful payment, Stripe redirects back to a success URL (e.g., `/billing?success=true`).
    - **Logic**: If `success=true` is detected in the URL, the frontend calls the `createSubscription` reducer with the mock or real subscription ID.

## 3. Stripe Configuration (Test Mode)

- Use a Stripe Publishable Key (Test Mode) in `.env.local`.
- Use a predefined Price ID from the Stripe Dashboard for the $59/mo plan.
- *Note*: In a production SpacetimeDB environment, webhook handlers would be used for robust lifecycle management (cancellations, failed payments). For this scaffold, we focus on the successful checkout wire-up.

## 4. Testing & Verification

- **Mock Payment**: Use Stripe test card numbers (e.g., 4242 4242...).
- **Upgrade Verification**: Confirm that the `shops` record in SpacetimeDB updates the `plan` to "premium" and stores the subscription ID.
- **Access Control**: (Optional) Verify that "premium" features are conditionally rendered based on the shop's plan.

## 5. Execution Steps

1. [ ] **Backend**: Update `shops` table and implement `createSubscription`.
2. [ ] **Frontend**: Install `@stripe/stripe-js`.
3. [ ] **Frontend**: Create the `Billing` page and "Upgrade" button logic.
4. [ ] **Frontend**: Implement the "Success" callback logic to call the reducer.
5. [ ] **Verification**: Perform a test checkout and verify the shop state change.
6. [ ] **Commit**: `Stripe billing wired`.
