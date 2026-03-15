# TODO: Chemical Safety Vault SDS S3 Upload

- [x] **1. Backend S3 Integration** `[backend]` `[database]`
  - [x] Implement `requestS3Upload(filename: string)` reducer in `spacetimedb/src/index.ts`:
    - [x] Add manual S3 presigned URL signing logic (or use SDK if compatible).
    - [x] Return both `presignedUrl` and `publicUrl`.
  - [x] Implement `attachSDS(chemical_id: u32, filename: string, s3_url: string, expiry_date: timestamp)` reducer:
    - [x] Ensure multi-tenancy check using `getShopId(ctx)`.
    - [x] Store metadata in `sds_documents` table.
  - [x] Implement `deleteSDS(sds_id: u32)` reducer:
    - [x] Verify ownership before deletion.
    - [x] Remove record from `sds_documents`.

- [x] **2. Frontend Dependencies & UI Updates** `[frontend]` `[parallel]`
  - [x] Install `axios` for robust HTTP PUT requests: `npm install axios` in `client/`.
  - [x] Update `client/src/pages/SDS.tsx` UI:
    - [x] Add a visual "Delete" button to the linked documents list.
    - [x] Implement an "Uploading..." state with a progress indicator or spinner.

- [x] **3. SDS Upload Logic Implementation** `[frontend]`
  - [x] Refactor `onSubmit` in `SDS.tsx` to follow the multi-stage flow:
    - [x] Stage 1: Call `reducers.requestS3Upload`.
    - [x] Stage 2: Perform `PUT` to S3 using the received presigned URL.
    - [x] Stage 3: Call `reducers.attachSDS` with the resulting public URL.
  - [x] Implement error handling for each stage (e.g., toast notifications).


- [x] **4. Multi-Tenant Verification & Binding Regeneration** `[test]`
  - [x] Regenerate client bindings: `npm run spacetime:generate`.
  - [x] Verify that the `requestS3Upload` and `attachSDS` reducers are correctly mapped in `client/src/module_bindings/`.

- [x] **5. Final Verification & Build** `[test]`
  - [x] Run `npm run build` in `spacetimedb/`.
  - [x] Run `npm run build` in `client/`.
  - [x] Commit changes with message: `SDS upload working`.
