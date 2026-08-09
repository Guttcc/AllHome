import { desc, eq } from "drizzle-orm";
import { db } from "./db/client";
import { allhomeItems } from "./db/schema";

export const listGroceryItems = async () => {
    const rows = await db.select().from(allhomeItems).orderBy(desc(allhomeItems.updated_at));

    return rows;
};

export const createGroceryItem = async (input: {
    name: string;
    category: string;
    quantity: number;
    priority: string;
}) => {
    const rows = await db
    .insert(allhomeItems)
    .values({
        id: crypto.randomUUID(),
        name: input.name,
        category: input.category,
        quantity: Math.max(1, input.quantity),
        purchased: false,
        priority: input.priority,
        updated_at: Date.now(),
    })
    .returning();

    return rows[0];
};

export const setGroceryItemPurchased = async (id: string, purchased: boolean) => {
    const rows = await db
        .update(allhomeItems)
        .set({ purchased, updated_at: Date.now() })
        .where(eq(allhomeItems.id, id))
        .returning();

    if (!rows.length) return null;
    return rows[0];
};

export const updateGroceryItemQuantity = async (id: string, quantity: number) => {
    const rows = await db
        .update(allhomeItems)
        .set({ quantity: Math.max(1, Math.floor(quantity)), updated_at: Date.now() })
        .where(eq(allhomeItems.id, id))
        .returning();

    if (!rows.length) return null;
    return rows[0];
};

export const deleteGroceryItem = async (id: string) => {
    await db.delete(allhomeItems).where(eq(allhomeItems.id, id));
};

export const clearPurchasedItems = async () => {
    await db.delete(allhomeItems).where(eq(allhomeItems.purchased, true));
};