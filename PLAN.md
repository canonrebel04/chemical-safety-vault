# Plan: Chemical Safety Vault Initial Scaffold

This plan outlines the steps to initialize the `chemical-safety-vault` repository with SpacetimeDB, restructure the folders, configure PWA features, install UI dependencies, and implement a basic landing page.

## 1. Initialization
- [ ] Initialize the project using the SpacetimeDB CLI React TS template: `spacetime dev --template react-ts`.
- [ ] Verify the generated folder structure.

## 2. Restructuring
- [ ] Rename the backend module directory to `spacetimedb/`.
- [ ] Rename the frontend React directory to `client/`.
- [ ] Ensure a `public/` directory exists (typically within `client/`) for the PWA manifest and assets.

## 3. PWA Configuration
- [ ] Create `client/public/manifest.json` with appropriate metadata (icons, colors, display mode).
- [ ] Implement a basic service worker for offline caching of forms in `client/src/sw.ts` or `client/public/service-worker.js`.
- [ ] Register the service worker in the main entry point (`client/src/main.tsx`).

## 4. Dependency Installation (Frontend)
- [ ] Navigate to the `client/` directory.
- [ ] Install core libraries: `lucide-react`, `date-fns`, `zustand`, `react-hook-form`, `zod`.
- [ ] Setup Tailwind CSS.
- [ ] Initialize and install `shadcn/ui` components.

## 5. UI Implementation
- [ ] Create a basic Landing Page component at `/`.
    - Text: "Chemical Safety Log Vault – for auto-parts & small blender shops".
    - Button: "Launch App" linking to `/dashboard`.
- [ ] Setup basic routing using `react-router-dom` (or similar) to support `/` and `/dashboard`.

## 6. Finalization
- [ ] Verify the application runs and the PWA manifest is detected.
- [ ] Stage all changes.
- [ ] Commit with the message: `initial spacetime scaffold + PWA`.
- [ ] Output the final folder tree.

## Next Steps
- Implement the SpacetimeDB module logic in `spacetimedb/`.
- Build out the dashboard and forms in `client/`.
