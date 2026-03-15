# TODO: Chemical Safety Vault Auth & Multi-Tenancy

- [x] **1. Backend Schema & Logic Updates** `[backend]` `[database]`
  - [x] Add `users` table to `spacetimedb/src/index.ts` (id, shop_id, email, role).
  - [x] Add `invites` table (id, shop_id, invitee_email, status).
  - [x] Implement `initUser(email: string)` reducer:
    - [x] Check if user exists.
    - [x] If not, create a new `shops` record and a `users` record.
  - [x] Implement `inviteUser(email: string)` and `acceptInvite(shop_id: Identity)` reducers.
  - [x] Refactor existing reducers (`addInventoryItem`, `logSpill`, etc.) to:
    - [x] Fetch the user's `shop_id` from the `users` table.
    - [x] Enforce that the operation only affects data for that `shop_id`.

- [x] **2. Frontend Auth Integration** `[frontend]`
  - [x] Create `client/src/contexts/AuthContext.tsx` to manage SpacetimeDB identity and user profile.
  - [x] Implement a `ProtectedRoute` wrapper component.
  - [x] Create a `Login` page (`client/src/pages/Login.tsx`) for first-time user initialization.
  - [x] Implement `Logout` functionality (clear token, reset state).

- [x] **3. Multi-Tenancy & Data Isolation** `[frontend]` `[security]`
  - [x] Update `client/src/main.tsx` subscriptions to filter by `shop_id` (using SpacetimeDB's server-side filtering syntax if available).
  - [x] Ensure all page-level `useTable` hooks only display data belonging to the current user's shop.

- [x] **4. User Management & Invites UI** `[frontend]`
  - [x] Add a "Team" page or dialog to view current shop members.
  - [x] Display the shareable `shop_id`.
  - [x] Implement the "Join Shop" flow (entering a shop ID to switch shops).

- [x] **5. Testing & Validation** `[test]`
  - [x] Verify User A cannot see User B's inventory (manual cross-browser test).
  - [x] Verify the invite/join flow correctly merges a user into an existing shop.
  - [x] Regenerate client bindings: `npm run spacetime:generate`.
  - [x] Run production build: `npm run build`.

- [x] **6. Finalization**
  - [x] Commit changes with message: `auth + multi-tenancy locked`.
