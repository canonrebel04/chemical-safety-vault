import { schema, table, t } from 'spacetimedb/server';
import { Identity } from 'spacetimedb';

/**
 * SCHEMA DIAGRAM
 * 
 * shops (PK: id [Identity])
 *   |
 *   +-- users (PK: id [Identity], FK: shop_id)
 *   +-- invites (PK: id [u32 autoInc], FK: shop_id)
 *   |
 *   +-- chemical_inventory (FK: shop_id, PK: id [u32 autoInc])
 *   |     |
 *   |     +-- sds_documents (FK: shop_id, chemical_id, PK: id [u32 autoInc])
 *   |     +-- spill_reports (FK: shop_id, chemical_id, PK: id [u32 autoInc])
 *   |
 *   +-- compliance_deadlines (FK: shop_id, PK: id [u32 autoInc])
 *   +-- audit_logs (FK: shop_id, PK: id [u32 autoInc])
 * 
 * Multi-tenancy enforced by looking up user's shop_id in every reducer.
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
  users: table(
    { public: true },
    {
      id: t.identity().primaryKey(),
      shop_id: t.identity().index(),
      email: t.string().unique(),
      role: t.string(), // "admin", "technician"
    }
  ),
  invites: table(
    { public: true },
    {
      id: t.u32().primaryKey().autoInc(),
      shop_id: t.identity().index(),
      invitee_email: t.string().index(),
      status: t.string(), // "pending", "accepted", "rejected"
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
function logAction(ctx: any, shop_id: Identity, action: string, details: string) {
  ctx.db.audit_logs.insert({
    id: 0, 
    shop_id,
    action,
    user: ctx.sender,
    timestamp: ctx.timestamp,
    details,
  });
}

// Helper to get user's shop_id
function getShopId(ctx: any): Identity {
  const user = ctx.db.users.id.find(ctx.sender);
  if (!user) {
    throw new Error("User not initialized. Call initUser first.");
  }
  return user.shop_id;
}

export const init = spacetimedb.init((_ctx) => {
  // Called when the module is initially published
});

export const initUser = spacetimedb.reducer(
  { email: t.string() },
  (ctx, { email }) => {
    let user = ctx.db.users.id.find(ctx.sender);
    if (!user) {
      // First login: create a shop and user record
      const shopName = `${email.split('@')[0]}'s Shop`;
      ctx.db.shops.insert({
        id: ctx.sender,
        name: shopName,
        owner: ctx.sender,
      });
      ctx.db.users.insert({
        id: ctx.sender,
        shop_id: ctx.sender,
        email,
        role: "admin",
      });
      logAction(ctx, ctx.sender, "INIT_USER", `User ${email} initialized with shop ${shopName}.`);
    }
  }
);

export const inviteUser = spacetimedb.reducer(
  { email: t.string() },
  (ctx, { email }) => {
    const shop_id = getShopId(ctx);
    ctx.db.invites.insert({
      id: 0,
      shop_id,
      invitee_email: email,
      status: "pending",
    });
    logAction(ctx, shop_id, "INVITE_USER", `Invited ${email} to shop.`);
  }
);

export const acceptInvite = spacetimedb.reducer(
  { shop_id: t.identity() },
  (ctx, { shop_id }) => {
    const user = ctx.db.users.id.find(ctx.sender);
    if (!user) {
      throw new Error("User not found. Call initUser first.");
    }

    // Check if there is a pending invite
    const invite = Array.from(ctx.db.invites.invitee_email.filter(user.email)).find(
      i => i.shop_id.toHexString() === shop_id.toHexString() && i.status === "pending"
    );

    if (!invite) {
      throw new Error("No pending invite found for this shop.");
    }

    // Update user's shop_id
    ctx.db.users.id.update({
      ...user,
      shop_id,
    });

    // Update invite status
    ctx.db.invites.id.update({
      ...invite,
      status: "accepted",
    });

    logAction(ctx, shop_id, "ACCEPT_INVITE", `User ${user.email} joined shop.`);
  }
);

export const createShop = spacetimedb.reducer(
  { name: t.string() },
  (ctx, { name }) => {
    // Identity is used as PK, so we use ctx.sender
    ctx.db.shops.insert({
      id: ctx.sender,
      name,
      owner: ctx.sender,
    });
    logAction(ctx, ctx.sender, "CREATE_SHOP", `Shop '${name}' created manually.`);
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
    const shop_id = getShopId(ctx);
    ctx.db.chemical_inventory.insert({
      id: 0,
      ...item,
      shop_id,
      last_updated: ctx.timestamp,
    });
    logAction(ctx, shop_id, "ADD_INVENTORY", `Added chemical '${item.name}' to inventory.`);
  }
);

export const updateQuantity = spacetimedb.reducer(
  { chemical_id: t.u32(), new_quantity: t.f32() },
  (ctx, { chemical_id, new_quantity }) => {
    const shop_id = getShopId(ctx);
    const item = ctx.db.chemical_inventory.id.find(chemical_id);
    if (!item) throw new Error("Item not found");
    if (item.shop_id.toHexString() !== shop_id.toHexString()) {
      throw new Error("Unauthorized access to shop inventory");
    }

    ctx.db.chemical_inventory.id.update({
      ...item,
      quantity: new_quantity,
      last_updated: ctx.timestamp,
    });
    logAction(ctx, shop_id, "UPDATE_QUANTITY", `Updated quantity of chemical ID ${chemical_id} to ${new_quantity}.`);
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
    const shop_id = getShopId(ctx);
    const item = ctx.db.chemical_inventory.id.find(sds.chemical_id);
    if (!item || item.shop_id.toHexString() !== shop_id.toHexString()) {
      throw new Error("Invalid chemical ID or unauthorized");
    }

    ctx.db.sds_documents.insert({
      id: 0,
      ...sds,
      shop_id,
    });
    logAction(ctx, shop_id, "UPLOAD_SDS", `Uploaded SDS for chemical ID ${sds.chemical_id}.`);
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
    const shop_id = getShopId(ctx);
    const item = ctx.db.chemical_inventory.id.find(spill.chemical_id);
    if (!item || item.shop_id.toHexString() !== shop_id.toHexString()) {
      throw new Error("Invalid chemical ID or unauthorized");
    }

    ctx.db.spill_reports.insert({
      id: 0,
      ...spill,
      shop_id,
      date: ctx.timestamp,
    });
    logAction(ctx, shop_id, "LOG_SPILL", `Logged spill of ${spill.amount_spilled} units of chemical ID ${spill.chemical_id}.`);
  }
);

export const createDeadline = spacetimedb.reducer(
  {
    type: t.string(),
    description: t.string(),
    due_date: t.timestamp(),
  },
  (ctx, deadline) => {
    const shop_id = getShopId(ctx);
    ctx.db.compliance_deadlines.insert({
      id: 0,
      ...deadline,
      shop_id,
      status: "Pending",
    });
    logAction(ctx, shop_id, "CREATE_DEADLINE", `Created ${deadline.type} deadline for ${deadline.due_date.toISOString()}.`);
  }
);

export const generateSafetyAudit = spacetimedb.reducer(
  (ctx) => {
    const shop_id = getShopId(ctx);
    const thirtyDaysInMs = BigInt(30 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgoMillis = ctx.timestamp.toMillis() - thirtyDaysInMs;
    
    const spills = Array.from(ctx.db.spill_reports.shop_id.filter(shop_id)).filter(
      (s: any) => s.date.toMillis() >= thirtyDaysAgoMillis
    );
    const inventory = Array.from(ctx.db.chemical_inventory.shop_id.filter(shop_id));
    const deadlines = Array.from(ctx.db.compliance_deadlines.shop_id.filter(shop_id));

    const auditReport = {
      generated_at: ctx.timestamp.toISOString(),
      shop_id: shop_id.toHexString(),
      spills_count: spills.length,
      inventory_total: inventory.length,
      active_deadlines: deadlines.filter((d: any) => d.status === "Pending").length,
      details: {
        spills,
        inventory,
        deadlines
      }
    };

    logAction(ctx, shop_id, "GENERATE_AUDIT", `Safety audit report generated.`);
    console.info(JSON.stringify(auditReport, null, 2));
  }
);
