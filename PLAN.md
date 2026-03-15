# Plan: Auth + Multi-Tenancy Locked

This plan outlines the implementation of a robust authentication and multi-tenancy system for the Chemical Safety Vault using SpacetimeDB.

## 1. Backend: Identity and Multi-Tenancy (`spacetimedb/src/index.ts`)

- **User & Shop Association**: 
    - Keep the existing `shops` table.
    - Add a `users` table: `id: Identity` (PK), `shop_id: Identity`, `email: string`, `role: string`.
- **Automatic Shop Creation**: 
    - Implement a `login` or `initUser` reducer.
    - If `ctx.sender` does not exist in `users`, create a new `shops` record (where `owner = ctx.sender`) and a `users` record pointing to that shop.
- **Invite Flow**:
    - Implement an `inviteUser(email: string)` reducer: creates a pending invite.
    - Implement an `acceptInvite(shop_id: Identity)` reducer: updates the user's `shop_id` to the invited shop.
- **Strict Enforcement**:
    - Every data-modifying reducer must look up the user's `shop_id` from the `users` table and use it for the operation.
    - Validate that the user belongs to the shop they are trying to modify.

## 2. Frontend: Authentication & Protected Routes (`client/`)

- **Auth State Management**:
    - Utilize SpacetimeDB's built-in identity management.
    - Create an `AuthContext` or use `useSpacetimeDB` to track if the user is "logged in" (identity exists and user record is initialized).
- **Login/Register Page**:
    - A simple view to initiate the connection. Since SpacetimeDB handles the identity, this might just be a "Get Started" button that triggers the initial reducer.
- **Route Protection**:
    - Implement a `ProtectedRoute` component that redirects to `/` or `/login` if no identity is present.
    - Protect `/dashboard`, `/inventory`, `/sds`, `/spills`, `/deadlines`, `/audits`.
- **Multi-Tenant Subscriptions**:
    - Update subscriptions in `main.tsx` to use server-side filtering (if supported by the SDK version) or ensure the frontend logic only displays data matching the user's `shop_id`.
- **Logout**:
    - Clear the auth token from `localStorage` and reset the SpacetimeDB connection.

## 3. Invite UI

- Add a "Team" or "Settings" section in `/dashboard` or a new page.
- Display the current `shop_id` (as a shareable code/link).
- Form to "Join Shop" by entering a `shop_id`.

## 4. Testing & Verification

- **Isolation Test**: 
    - Create User A -> Add chemical "Acetone".
    - Create User B -> Verify User B cannot see "Acetone".
- **Invite Test**:
    - User A invites User B.
    - User B joins Shop A.
    - Verify User B can now see "Acetone".

## 5. Execution Steps

1. [ ] **Backend**: Update schema with `users` and `invites` tables.
2. [ ] **Backend**: Implement `initUser`, `inviteUser`, and `acceptInvite` reducers.
3. [ ] **Backend**: Refactor existing reducers to pull `shop_id` from the `users` table.
4. [ ] **Frontend**: Implement `AuthContext` and `ProtectedRoute`.
5. [ ] **Frontend**: Build Login and Team management UI.
6. [ ] **Verification**: Run multi-user isolation tests.
7. [ ] **Commit**: `auth + multi-tenancy locked`.
