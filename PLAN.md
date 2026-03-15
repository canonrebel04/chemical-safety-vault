# Plan: Codebase Review and v0.1 Improvements

This plan details the review findings, suggested v0.1 features, and a testing strategy for real-world validation with shop owners.

## 1. Codebase Review Summary
- **Architecture**: Robust PWA setup with SpacetimeDB for real-time sync and data persistence.
- **Security**: Multi-tenancy is strictly enforced via `shop_id` in both backend reducers and frontend filters.
- **PWA Features**: Includes offline drafts, install prompts, and service-worker caching.
- **Integrations**: Stripe billing and S3 upload flows are ready for test mode.

## 2. Suggested Quick Improvements (v0.1)

1. **Integrated Barcode Scanner**: 
   - Replace the placeholder in `Inventory.tsx` with `html5-qrcode`.
   - Allow technicians to scan chemicals directly using their phone's camera.
2. **OSHA Regulation Auto-Sync (Mock)**:
   - Add a "Sync OSHA Deadlines" button in `Deadlines.tsx`.
   - Auto-populate standard regulatory dates (e.g., "Annual Hazard Communication Training") based on the current year.
3. **Professional Report Branding**:
   - Enhance `pdf-generator.ts` with a high-fidelity header and custom footer including the vault's "Confidential" seal.
4. **SDS Expiry Proactive Alerts**:
   - Update `useDeadlineChecker.ts` to also scan `sds_documents` for upcoming expiry dates.
5. **Team Activity Feed**:
   - Add a "Recent Activity" card to the `Dashboard.tsx` that displays the last 5 entries from `audit_logs` for that shop.

## 3. Shop-Owner Testing Task List

### Goals
- Validate the "offline-first" value proposition.
- Assess the ease of use for non-technical workshop staff.
- Confirm if the generated PDF meets their compliance needs.

### What to Ask
- "What's your current method for tracking chemical safety logs (e.g., binder, Excel, memory)?"
- "How often does your shop lose Wi-Fi, and would a 'draft' mode save you time?"
- "Does this PDF report look like something you could hand to an OSHA inspector with confidence?"

### Demo Sequence
1. **The Live Vault**: Add an item on phone A, show it appearing instantly on phone B.
2. **Offline Resilience**: Toggle 'Airplane Mode', log a mock spill, turn Wi-Fi back on, and sync the draft.
3. **One-Click Audit**: Generate the OSHA PDF and show the immediate audit log entry.

## 4. Execution Commands

### Run Locally
```bash
spacetime dev --module-path spacetimedb & cd client && npm run dev
```

### Deploy to Production
```bash
spacetime publish --server maincloud chemical-safety-vault --module-path spacetimedb
```

## 5. Next Steps
1. [ ] Implement the Barcode Scanner.
2. [ ] Polish the PDF Export Branding.
3. [ ] Conduct the 3 shop-owner interviews.
4. [ ] Refine roadmap based on feedback.
