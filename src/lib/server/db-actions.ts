import { and, desc, eq, inArray, isNull, or } from "drizzle-orm";
import { db } from "./db/client";
import { allhomeItems, groupMembers } from "./db/schema";

export const listGroceryItems = async (userId?: string) => {
    if (!userId) {
        return [];
    }

    try {
        const userGroups = await db
            .select({ groupId: groupMembers.groupId })
            .from(groupMembers)
            .where(eq(groupMembers.userId, userId));

        const groupIds = userGroups.map((g) => g.groupId).filter(Boolean);

        const conditions = [
            and(eq(allhomeItems.userId, userId), isNull(allhomeItems.groupId)),
        ];

        if (groupIds.length > 0) {
            conditions.push(inArray(allhomeItems.groupId, groupIds));
        }

        const rawItems = await db
            .select()
            .from(allhomeItems)
            .where(or(...conditions))
            .orderBy(desc(allhomeItems.updated_at));

        return rawItems.map((item: any) => ({
            id: item.id,
            name: item.name,
            category: item.category ?? null,
            quantity: item.quantity,
            purchased: item.purchased,
            priority: item.priority,
            updated_at: item.updated_at,
            price: item.price !== null && item.price !== undefined ? Number(item.price) : null,
            imageUri: item.imageUri ?? item.image_uri ?? null,
            userId: item.userId ?? item.user_id ?? null,
            groupId: item.groupId ?? item.group_id ?? null,
        }));
    } catch (error) {
        console.error("Error filtering items by user/group:", error);
        return [];
    }
};

export const createGroceryItem = async (input: {
    name: string;
    category?: string | null;
    quantity: number;
    priority: string;
    price?: number | null;
    imageUri?: string | null;
    groupId?: string | null;
    userId?: string;
}) => {
    const rows = await db
        .insert(allhomeItems)
        .values({
            id: crypto.randomUUID(),
            name: input.name,
            category: input.category?.trim() ? input.category.trim() : null,
            quantity: Math.max(1, input.quantity),
            purchased: false,
            priority: input.priority,
            updated_at: Date.now(),
            price: input.price !== undefined && input.price !== null ? String(input.price) : null,
            imageUri: input.imageUri ?? null,
            groupId: input.groupId ?? null,
            userId: input.userId ?? null,
        })
        .returning();

    const row = rows[0] as any;
    return {
        ...row,
        price: row.price !== null && row.price !== undefined ? Number(row.price) : null,
    };
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