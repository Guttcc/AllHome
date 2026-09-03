import { GroceryItem } from "@/store/grocery-store";

export function calculateContextTotal(items: GroceryItem[], activeContext: string) {
    const contextItems = items.filter((item) => {
        if (activeContext === "personal") return !item.groupId;
        return item.groupId === activeContext;
    });

    const pendingItems = contextItems.filter((item) => !item.purchased);
    const itemsWithPrice = pendingItems.filter(
        (item) => item.price !== null && item.price !== undefined
    );

    const total = itemsWithPrice.reduce(
        (sum, item) => sum + (item.price ?? 0) * item.quantity,
        0
    );

    return {
        total,
        pendingCount: pendingItems.length,
        itemsWithPriceCount: itemsWithPrice.length,
    };
}