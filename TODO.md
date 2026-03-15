# TODO: Chemical Safety Vault Initial Scaffold

- [x] 1. Initialize project with SpacetimeDB CLI
    - [x] Run `spacetime dev --template react-ts`
- [x] 2. Restructure folder hierarchy
    - [x] Rename module directory to `spacetimedb/`
    - [x] Rename client directory to `client/`
- [x] 3. PWA Setup
    - [x] Add `client/public/manifest.json`
    - [x] Add `client/src/sw.ts` (service-worker.js)
    - [x] Register service worker in `client/src/main.tsx`
- [x] 4. Dependencies & UI Setup
    - [x] Install `tailwind`, `shadcn/ui`, `lucide-react`, `date-fns`, `zustand`, `react-hook-form`, `zod`
    - [x] Configure Tailwind in `client/`
- [x] 5. Landing Page & Routing
    - [x] Add basic landing page with "Chemical Safety Log Vault" text
    - [x] Add "Launch App" button to `/dashboard`
- [ ] 6. Initial Commit
    - [ ] Stage and commit with message "initial spacetime scaffold + PWA"
