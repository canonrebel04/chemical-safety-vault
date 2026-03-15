# TODO: Chemical Safety Vault MVP Launch

- [x] **1. PWA & Offline Enhancements** `[frontend]`
  - [x] Implement `InstallPrompt` component to handle `beforeinstallprompt` event.
  - [x] Implement `OfflineDrafts` manager using `localStorage`:
    - [x] Create a helper to save form data when `navigator.onLine` is false.
    - [x] Add a "Sync Drafts" banner/button when connection returns.
  - [x] Ensure `Loader2` spinners are integrated into all reducer-calling buttons.
  - [x] Implement global error handling for reducers using `sonner` toasts.

- [x] **2. Compliance Data Export** `[frontend]`
  - [x] Create `client/src/lib/export-utils.ts` for CSV/JSON generation.
  - [x] Update `Audits.tsx` UI:
    - [x] Add "Export All Shop Data" section.
    - [x] Implement "Download as CSV" buttons for Inventory, Spills, and Deadlines.
    - [x] Implement "Download as JSON" for the full vault dump.

- [x] **3. Documentation & Final Polish** `[frontend]` `[test]`
  - [x] Comprehensive update to `README.md`:
    - [x] Add local development steps (`spacetime dev`).
    - [x] Add deployment guide (`spacetime publish`).
    - [x] List all required environment variables.
  - [x] Run a final PWA audit (manual check) and fix manifest/service worker issues.

- [x] **4. Final Deployment Verification** `[backend]` `[frontend]` `[test]`
  - [x] Regenerate client bindings: `npm run spacetime:generate`.
  - [x] Run production builds: `npm run build` in both backend and frontend.
  - [x] Run mock `spacetime publish` and verify placeholder URL.

- [x] **5. Finalization**
  - [x] Commit changes with message: `MVP ready for launch`.
