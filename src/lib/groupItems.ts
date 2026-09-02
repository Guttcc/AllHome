import { GroceryItem } from "@/store/grocery-store";

const PRIORITY_WEIGHT: Record<string, number> = {
    high: 0,
    medium: 1,
    low: 2,
};

export const UNCATEGORIZED_KEY = "__uncategorized__";

export type ItemGroup = {
    key: string;
    label: string;
    items: GroceryItem[];
};

/**
 * Agrupa los items por categoría (comparando sin importar mayúsculas/espacios)
 * y, dentro de cada grupo, los ordena por prioridad: alta -> media -> baja.
 * Los items sin categoría quedan en un grupo aparte, siempre al final.
 */
export function groupItemsByCategory(items: GroceryItem[], uncategorizedLabel: string): ItemGroup[] {
    const groupsMap = new Map<string, ItemGroup>();

    for (const item of items) {
        const rawCategory = item.category?.trim();
        const key = rawCategory ? rawCategory.toLowerCase() : UNCATEGORIZED_KEY;

        if (!groupsMap.has(key)) {
            groupsMap.set(key, {
                key,
                label: rawCategory || uncategorizedLabel,
                items: [],
            });
        }

        groupsMap.get(key)!.items.push(item);
    }

    const sortedGroups = Array.from(groupsMap.values());

    for (const group of sortedGroups) {
        group.items.sort((a, b) => {
            const weightA = PRIORITY_WEIGHT[a.priority] ?? 1;
            const weightB = PRIORITY_WEIGHT[b.priority] ?? 1;
            return weightA - weightB;
        });
    }

    sortedGroups.sort((a, b) => {
        if (a.key === UNCATEGORIZED_KEY) return 1;
        if (b.key === UNCATEGORIZED_KEY) return -1;
        return 0;
    });

    return sortedGroups;
}