import { schema, table, t } from 'spacetimedb/server';

/**
 * SCHEMA DIAGRAM
 * 
 * shops (PK: id [Identity])
 *   |
 *   +-- chemical_inventory (FK: shop_id, PK: id [u32 autoInc])
 *   |     |
 *   |     +-- sds_documents (FK: shop_id, chemical_id, PK: id [u32 autoInc])
 *   |     +-- spill_reports (FK: shop_id, chemical_id, PK: id [u32 autoInc])
 *   |
 *   +-- compliance_deadlines (FK: shop_id, PK: id [u32 autoInc])
 *   +-- audit_logs (FK: shop_id, PK: id [u32 autoInc])
 * 
 * Multi-tenancy enforced by Identity-based shop_id on every row.
 */

const spacetimedb = schema({
  shops: table(
    { public: true },
    {
      id: t.identity().primaryKey(),
      name: t.string(),
      owner: t.identity().unique(),
    }
  ),
  chemical_inventory: table(
    { public: true },
    {
      id: t.u32().primaryKey().autoInc(),
      shop_id: t.identity().index(),
      cas_number: t.string(),
      name: t.string(),
      quantity: t.f32(),
      unit: t.string(),
      location: t.string(),
      last_updated: t.timestamp(),
    }
  ),
  sds_documents: table(
    { public: true },
    {
      id: t.u32().primaryKey().autoInc(),
      shop_id: t.identity().index(),
      chemical_id: t.u32().index(),
      filename: t.string(),
      s3_url: t.string(),
      expiry_date: t.timestamp(),
    }
  ),
  spill_reports: table(
    { public: true },
    {
      id: t.u32().primaryKey().autoInc(),
      shop_id: t.identity().index(),
      chemical_id: t.u32(),
      date: t.timestamp(),
      amount_spilled: t.f32(),
      description: t.string(),
      actions_taken: t.string(),
      witnesses: t.string(),
    }
  ),
  compliance_deadlines: table(
    { public: true },
    {
      id: t.u32().primaryKey().autoInc(),
      shop_id: t.identity().index(),
      type: t.string(), // OSHA/EPA/HIPAA/etc
      description: t.string(),
      due_date: t.timestamp(),
      status: t.string(), // Pending, Completed, Overdue
    }
  ),
  audit_logs: table(
    { public: true },
    {
      id: t.u32().primaryKey().autoInc(),
      shop_id: t.identity().index(),
      action: t.string(),
      user: t.identity(),
      timestamp: t.timestamp(),
      details: t.string(),
    }
  ),
});

export default spacetimedb;

// Helper function for automatic audit logs
function logAction(ctx: any, shop_id: any, action: string, details: string) {
  ctx.db.audit_logs.insert({
    id: 0, 
    shop_id,
    action,
    user: ctx.sender,
    timestamp: ctx.timestamp,
    details,
  });
}

export const init = spacetimedb.init((_ctx) => {
  // Called when the module is initially published
});

export const createShop = spacetimedb.reducer(
  { name: t.string() },
  (ctx, { name }) => {
    ctx.db.shops.insert({
      id: ctx.sender,
      name,
      owner: ctx.sender,
    });
    logAction(ctx, ctx.sender, "CREATE_SHOP", `Shop '${name}' created.`);
  }
);

export const addInventoryItem = spacetimedb.reducer(
  {
    cas_number: t.string(),
    name: t.string(),
    quantity: t.f32(),
    unit: t.string(),
    location: t.string(),
  },
  (ctx, item) => {
    ctx.db.chemical_inventory.insert({
      id: 0,
      ...item,
      shop_id: ctx.sender,
      last_updated: ctx.timestamp,
    });
    logAction(ctx, ctx.sender, "ADD_INVENTORY", `Added chemical '${item.name}' to inventory.`);
  }
);

export const updateQuantity = spacetimedb.reducer(
  { chemical_id: t.u32(), new_quantity: t.f32() },
  (ctx, { chemical_id, new_quantity }) => {
    const item = ctx.db.chemical_inventory.id.find(chemical_id);
    if (!item) throw new Error("Item not found");
    if (item.shop_id.toHexString() !== ctx.sender.toHexString()) {
      throw new Error("Unauthorized access to shop inventory");
    }

    ctx.db.chemical_inventory.id.update({
      ...item,
      quantity: new_quantity,
      last_updated: ctx.timestamp,
    });
    logAction(ctx, ctx.sender, "UPDATE_QUANTITY", `Updated quantity of chemical ID ${chemical_id} to ${new_quantity}.`);
  }
);

export const uploadSDS = spacetimedb.reducer(
  {
    chemical_id: t.u32(),
    filename: t.string(),
    s3_url: t.string(),
    expiry_date: t.timestamp(),
  },
  (ctx, sds) => {
    const item = ctx.db.chemical_inventory.id.find(sds.chemical_id);
    if (!item || item.shop_id.toHexString() !== ctx.sender.toHexString()) {
      throw new Error("Invalid chemical ID or unauthorized");
    }

    ctx.db.sds_documents.insert({
      id: 0,
      ...sds,
      shop_id: ctx.sender,
    });
    logAction(ctx, ctx.sender, "UPLOAD_SDS", `Uploaded SDS for chemical ID ${sds.chemical_id}.`);
  }
);

export const logSpill = spacetimedb.reducer(
  {
    chemical_id: t.u32(),
    amount_spilled: t.f32(),
    description: t.string(),
    actions_taken: t.string(),
    witnesses: t.string(),
  },
  (ctx, spill) => {
    const item = ctx.db.chemical_inventory.id.find(spill.chemical_id);
    if (!item || item.shop_id.toHexString() !== ctx.sender.toHexString()) {
      throw new Error("Invalid chemical ID or unauthorized");
    }

    ctx.db.spill_reports.insert({
      id: 0,
      ...spill,
      shop_id: ctx.sender,
      date: ctx.timestamp,
    });
    logAction(ctx, ctx.sender, "LOG_SPILL", `Logged spill of ${spill.amount_spilled} units of chemical ID ${spill.chemical_id}.`);
  }
);

export const createDeadline = spacetimedb.reducer(
  {
    type: t.string(),
    description: t.string(),
    due_date: t.timestamp(),
  },
  (ctx, deadline) => {
    ctx.db.compliance_deadlines.insert({
      id: 0,
      ...deadline,
      shop_id: ctx.sender,
      status: "Pending",
    });
    logAction(ctx, ctx.sender, "CREATE_DEADLINE", `Created ${deadline.type} deadline for ${deadline.due_date.toISOString()}.`);
  }
);

export const generateSafetyAudit = spacetimedb.reducer(
  (ctx) => {
    const thirtyDaysInMs = BigInt(30 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgoMillis = ctx.timestamp.toMillis() - thirtyDaysInMs;
    
    const spills = Array.from(ctx.db.spill_reports.shop_id.filter(ctx.sender)).filter(
      (s: any) => s.date.toMillis() >= thirtyDaysAgoMillis
    );
    const inventory = Array.from(ctx.db.chemical_inventory.shop_id.filter(ctx.sender));
    const deadlines = Array.from(ctx.db.compliance_deadlines.shop_id.filter(ctx.sender));

    const auditReport = {
      generated_at: ctx.timestamp.toISOString(),
      shop_id: ctx.sender.toHexString(),
      spills_count: spills.length,
      inventory_total: inventory.length,
      active_deadlines: deadlines.filter((d: any) => d.status === "Pending").length,
      details: {
        spills,
        inventory,
        deadlines
      }
    };

    logAction(ctx, ctx.sender, "GENERATE_AUDIT", `Safety audit report generated.`);
    console.info(JSON.stringify(auditReport, null, 2));
  }
);
