# Plan: MVP Ready for Launch

This plan outlines the final steps to polish the Chemical Safety Vault for its MVP release, focusing on offline capabilities, data portability, and production readiness.

## 1. PWA & Offline Enhancements (`client/`)

- **Install Prompt**: Implement a "beforeinstallprompt" handler to show a custom "Install App" button in the UI (e.g., in the Dashboard or Team page).
- **Offline Form Caching**: 
    - Update `service-worker.js` to handle basic `POST`/Reducer request interception OR implement a `localStorage` based draft system for chemical inventory and spill reports.
    - If offline, save the form data to a `drafts` key.
    - When back online, notify the user to "Sync Drafts".
- **Visual Feedback**:
    - Ensure all buttons show loading spinners (using `lucide-react`'s `Loader2`) during SpacetimeDB reducer calls.
    - Implement global error handling using `sonner` toasts for failed reducer calls.

## 2. Compliance: Data Export (`client/src/pages/Audits.tsx`)

- **Export All Logic**: 
    - A new utility to compile the entire shop's data into **JSON** and **CSV**.
    - CSV files for: `Inventory`, `Spills`, `Deadlines`.
    - Provide a single "Download Compliance Bundle (ZIP/Multiple)" or individual buttons.
- **UI**: Add an "Export All Shop Data" section to the Audits page.

## 3. Documentation & Deployment (`README.md`)

- **Local Development**:
    - Detailed `spacetime dev` instructions.
    - How to run the Vite dev server.
- **Production Deployment**:
    - Command: `spacetime publish --server maincloud chemical-safety-vault`.
    - Mention that bindings need to be regenerated after schema changes.
- **Environment Variables**:
    - Document `VITE_SPACETIMEDB_HOST`, `VITE_STRIPE_PUBLISHABLE_KEY`, and S3 bucket details.

## 4. Final Verification

- **PWA Audit**: Run a Lighthouse report to verify PWA installability and offline support.
- **End-to-End**: Create a new shop, add an item, upload an SDS, generate an audit, and upgrade to premium.
- **Live Test**: Run a mock `spacetime publish` and show the placeholder URL.

## 5. Execution Steps

1. [ ] **Frontend**: Implement PWA install prompt and "Offline Drafts" UI.
2. [ ] **Frontend**: Add loading states and error toasts to all forms.
3. [ ] **Frontend**: Implement CSV/JSON export for all tables.
4. [ ] **Documentation**: Update `README.md` with complete setup and deploy guides.
5. [ ] **Deployment**: Run mock publish and verify live state.
6. [ ] **Commit**: `MVP ready for launch`.
