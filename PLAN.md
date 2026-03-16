# Plan: Chemical Safety Vault Android Bootstrap

This plan outlines the steps to initialize a React Native project for Android, integrate SpacetimeDB, and set up the initial UI and configuration.

## 1. Project Initialization
- [ ] Initialize a bare React Native project with TypeScript template:
  `npx react-native@latest init ChemicalSafetyVault --template react-native-template-typescript`
- [ ] Move the project files to the root directory (or as required by the workspace structure).
- [ ] Remove the `ios/` folder to ensure an Android-only focus.

## 2. Dependency Installation
- [ ] Install styling and UI dependencies:
  - `nativewind` (and `tailwindcss`, `postcss`, `autoprefixer` as dev dependencies)
  - `lucide-react-native`
  - `react-native-vector-icons`
- [ ] Install logic and state management dependencies:
  - `react-hook-form`
  - `zod`
  - `zustand`
- [ ] Install navigation dependencies:
  - `@react-navigation/native`
  - `@react-navigation/stack`
  - `@react-navigation/bottom-tabs`
  - `react-native-safe-area-context`
  - `react-native-screens`
- [ ] Install SpacetimeDB SDK:
  - `@clockworklabs/spacetimedb-sdk`

## 3. SpacetimeDB Setup
- [ ] Ensure the `spacetimedb/` module folder is present (copied from the previous project).
- [ ] Generate TypeScript bindings for the backend:
  `spacetime generate --lang typescript --out-dir src/module_bindings --module-path spacetimedb`

## 4. Android Configuration
- [ ] Update `android/app/src/main/AndroidManifest.xml` to include:
  - `android.permission.CAMERA`
  - `android.permission.INTERNET`
  - `android.permission.WRITE_EXTERNAL_STORAGE`
- [ ] Configure `NativeWind` (Tailwind) for React Native:
  - Create `tailwind.config.js`.
  - Update `babel.config.js` with the `nativewind/babel` plugin.
  - Create a global CSS file or include tailwind in the project entry.

## 5. UI Implementation
- [ ] Create a simple Splash screen.
- [ ] Create a Landing screen:
  - Text: "Chemical Safety Log Vault"
  - Button: "Sign In"
- [ ] Set up basic navigation to host these screens.

## 6. Finalization
- [ ] Commit all changes with the message: `RN Android bootstrap + SpacetimeDB bindings`.
- [ ] Output the final folder tree.
