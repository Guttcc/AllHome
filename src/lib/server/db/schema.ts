import { bigint, boolean, integer, numeric, pgTable, text } from "drizzle-orm/pg-core";

export const allhomeItems = pgTable("allhome_items", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    category: text("category"),
    quantity: integer("quantity").notNull().default(1),
    purchased: boolean("purchased").notNull().default(false),
    priority: text("priority").notNull().default("medium"),
    updated_at: bigint("updated_at", { mode: "number" }).notNull(),

    price: numeric("price", { precision: 10, scale: 2 }),
    imageUri: text("image_uri"),

    userId: text("user_id"),
    groupId: text("group_id"),
});

export const groups = pgTable("groups", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    code: text("code").notNull().unique(),
    createdById: text("created_by_id").notNull(),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
});

export const groupMembers = pgTable("group_members", {
    id: text("id").primaryKey(),
    groupId: text("group_id").notNull(),
    userId: text("user_id").notNull(),
    role: text("role").notNull().default("member"),
    joinedAt: bigint("joined_at", { mode: "number" }).notNull(),
});