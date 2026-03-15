# Plan: SDS Upload Working

This plan outlines the implementation of a secure S3-based upload flow for Safety Data Sheets (SDS) in the Chemical Safety Vault.

## 1. Backend: S3 Integration Logic (`spacetimedb/src/index.ts`)

- **Configuration**: 
    - Store S3 bucket name and region as module constants (or environment variables if supported).
    - Note: AWS SDK typically requires secrets. In a real SpacetimeDB environment, secrets would be managed via the CLI/Dashboard. For this scaffold, we will use placeholders.
- **Reducers**:
    - `requestS3Upload(filename: string)`:
        - Uses AWS SDK (or a fetch-based manual signing logic) to generate a **PutObject** presigned URL.
        - Returns the presigned URL and the final intended public URL.
    - `attachSDS(chemical_id: u32, filename: string, s3_url: string, expiry_date: timestamp)`:
        - Stores the permanent public URL in the `sds_documents` table.
        - Enforces `shop_id` ownership via `getShopId(ctx)`.
    - `deleteSDS(sds_id: u32)`:
        - Removes the record from the `sds_documents` table.
        - Note: In this MVP, we won't trigger physical S3 deletion from the reducer (usually handled by a separate process or lifecycle policy), but we will remove the reference.

## 2. Frontend: Multi-Step Upload Flow (`client/src/pages/SDS.tsx`)

- **Dependencies**: 
    - Install `axios` or use `fetch` for the S3 PUT request.
- **Flow**:
    1. User selects a PDF file.
    2. Frontend calls `reducers.requestS3Upload(file.name)`.
    3. Frontend receives the presigned URL.
    4. Frontend performs a `PUT` request to the presigned URL with the file data.
    5. On success, frontend calls `reducers.attachSDS(...)` with the public URL and metadata.
- **UI Updates**:
    - Progress bar/indicator during the upload phase.
    - Success/Error notifications using shadcn/ui Toast or Alert.
    - Add a "Delete" button next to existing documents.

## 3. Storage Strategy

- **Bucket Policy**: Ensure the S3 bucket allows `PUT` from the application origin (CORS) and `GET` for the public URLs (or CloudFront).
- **Public URLs**: The `sds_documents` table stores only the final public URL (or CloudFront URL).

## 4. Testing & Verification

- **Presigned Verification**: Verify the generated URL is valid and contains the correct signing headers.
- **Upload Test**: Perform a manual upload and verify the PDF is accessible via the returned public URL.
- **Multi-Tenancy**: Verify that SDS documents are only visible/deletable by the shop that uploaded them.

## 5. Execution Steps

1. [ ] **Backend**: Install AWS SDK (if available in Spacetime JS environment) or implement signing helper.
2. [ ] **Backend**: Implement `requestS3Upload` and `attachSDS`.
3. [ ] **Backend**: Implement `deleteSDS`.
4. [ ] **Frontend**: Implement `SDS.tsx` logic to handle the two-stage upload (Request -> Upload -> Attach).
5. [ ] **Frontend**: Add delete functionality to the UI.
6. [ ] **Verification**: Test the end-to-end flow.
7. [ ] **Commit**: `SDS upload working`.
