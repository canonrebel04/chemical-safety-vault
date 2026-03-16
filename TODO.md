# TODO: Chemical Safety Vault React Native Android Bootstrap

- [x] **1. Project Initialization** `[frontend]`
  - [x] Initialize bare React Native project: `npx react-native@latest init ChemicalSafetyVault --template react-native-template-typescript`
  - [x] Delete the `ios/` folder.

- [x] **2. Dependency Installation** `[frontend]` `[parallel]`
  - [x] Install Tailwind dependencies: `npm install nativewind tailwindcss postcss autoprefixer`
  - [x] Install icon libraries: `npm install lucide-react-native react-native-vector-icons`
  - [x] Install forms & state: `npm install react-hook-form zod zustand`
  - [x] Install navigation: `npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs react-native-safe-area-context react-native-screens`
  - [x] Install SpacetimeDB: `npm install @clockworklabs/spacetimedb-sdk`

- [x] **3. Configuration & Permissions** `[frontend]` `[android]`
  - [x] Configure `tailwind.config.js` and update `babel.config.js` with `nativewind/babel`.
  - [x] Update `android/app/src/main/AndroidManifest.xml` with required permissions (`CAMERA`, `INTERNET`, `WRITE_EXTERNAL_STORAGE`).

- [x] **4. SpacetimeDB Setup** `[backend]` `[frontend]`
  - [x] Ensure `spacetimedb/` backend module exists (copy if necessary).
  - [x] Run `spacetime generate --lang typescript --out-dir src/module_bindings --module-path spacetimedb`.

- [x] **5. UI Implementation** `[frontend]`
  - [x] Create `src/screens/SplashScreen.tsx`.
  - [x] Create `src/screens/LandingScreen.tsx` with "Chemical Safety Log Vault" text and "Sign In" button.
  - [x] Setup base navigation stack in `App.tsx`.

- [ ] **6. Finalization** `[test]`
  - [ ] Verify Android build compiles successfully: `npm run android` (or standard verification step if no emulator available).
  - [ ] Commit all changes with message: `RN Android bootstrap + SpacetimeDB bindings`.
  - [ ] Output the final folder tree.
