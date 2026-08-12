import { create } from "zustand";

export type GroceryCategory = "Produce" | "Dairy" | "Bakery" | "Pantry" | "Snacks";
export type GroceryPriority = "low" | "medium" | "high";

export type FamilyGroup = {
    id: string;
    name: string;
    code: string;
};

export type GroceryItem = {
    id: string;
    name: string;
    category: GroceryCategory;
    quantity: number;
    purchased: boolean;
    priority: GroceryPriority;
    groupId?: string | null;
    createdByName?: string | null;
};

export type CreateItemInput = {
    name: string;
    category: GroceryCategory;
    quantity: number;
    priority: GroceryPriority;
    groupId?: string | null;
    createdByName?: string | null;
};

type ItemsResponse = { items: GroceryItem[] };
type ItemResponse = { item: GroceryItem };

type GroceryStore = {
    items: GroceryItem[];
    groups: FamilyGroup[];
    activeContext: "personal" | string; // "personal" o el ID del grupo activo
    isLoading: boolean;
    error: string | null;

    loadItems: () => Promise<void>;
    addItem: (input: CreateItemInput) => Promise<GroceryItem | void>;
    updateQuantity: (id: string, quantity: number) => Promise<void>;
    togglePurchased: (id: string) => Promise<void>;
    removeItem: (id: string) => Promise<void>;
    clearPurchased: () => Promise<void>;

    setActiveContext: (context: "personal" | string) => void;
    createGroup: (name: string, userId?: string) => Promise<FamilyGroup | void>;
    joinGroup: (codeOrLink: string, userId?: string) => Promise<FamilyGroup | void>;
    leaveGroup: (groupId: string) => Promise<void>;
};

export const useGroceryStore = create<GroceryStore>((set, get) => ({
    items: [],
    groups: [],
    activeContext: "personal",
    isLoading: false,
    error: null,

    setActiveContext: (context) => {
        set({ activeContext: context });
    },

    loadItems: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch("/api/items");
            const payload = (await res.json()) as ItemsResponse;

            if (!res.ok) throw new Error(`Request failed (${res.status})`);
            set({ items: payload.items });
        } catch (error) {
            console.error("Error loading items:", error);
            set({ error: "Something went wrong" });
        } finally {
            set({ isLoading: false });
        }
    },

    addItem: async (input) => {
        set({ error: null });
        try {
            const targetGroupId = input.groupId ?? (get().activeContext === "personal" ? null : get().activeContext);

            const res = await fetch("/api/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: input.name,
                    category: input.category,
                    quantity: Math.max(1, input.quantity),
                    priority: input.priority,
                    groupId: targetGroupId,
                    createdByName: input.createdByName ?? null,
                }),
            });
            const payload = (await res.json()) as ItemResponse;
            if (!res.ok) throw new Error(`Request failed (${res.status})`);

            set((state) => ({ items: [payload.item, ...state.items] }));
            return payload.item;
        } catch (error) {
            console.error("Error adding item:", error);
            set({ error: "Something went wrong" });
        }
    },

    updateQuantity: async (id, quantity) => {
        const nextQuantity = Math.max(1, quantity);
        set({ error: null });

        try {
            const res = await fetch(`/api/items/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantity: nextQuantity }),
            });
            const payload = (await res.json()) as ItemResponse;
            if (!res.ok) throw new Error(`Request failed (${res.status})`);
            set((state) => ({
                items: state.items.map((item) => (item.id === id ? payload.item : item)),
            }));
        } catch (error) {
            console.error("Error updating quantity:", error);
            set({ error: "Something went wrong" });
        }
    },

    togglePurchased: async (id) => {
        const currentItem = get().items.find((item) => item.id === id);
        if (!currentItem) return;

        const nextPurchased = !currentItem.purchased;
        set({ error: null });
        try {
            const res = await fetch(`/api/items/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ purchased: nextPurchased }),
            });

            const payload = (await res.json()) as ItemResponse;
            if (!res.ok) throw new Error(`Request failed (${res.status})`);

            set((state) => ({
                items: state.items.map((item) => (item.id === id ? payload.item : item)),
            }));
        } catch (error) {
            console.error("Error toggling purchased:", error);
            set({ error: "Something went wrong" });
        }
    },

    removeItem: async (id) => {
        set({ error: null });
        try {
            const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error(`Request failed (${res.status})`);

            set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
        } catch (error) {
            console.error("Error removing item:", error);
            set({ error: "Something went wrong" });
        }
    },

    clearPurchased: async () => {
        set({ error: null });
        try {
            const res = await fetch("/api/items/clear-purchased", { method: "POST" });
            if (!res.ok) throw new Error(`Request failed (${res.status})`);

            const items = get().items.filter((item) => !item.purchased);
            set({ items });
        } catch (error) {
            console.error("Error clearing purchased:", error);
            set({ error: "Something went wrong" });
        }
    },

    // Métodos de grupos
    createGroup: async (name: string, userId?: string) => {
        set({ error: null });
        try {
            const res = await fetch("/api/groups", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, userId }),
            });
            const newGroup = (await res.json()) as FamilyGroup;
            if (!res.ok) throw new Error(`Request failed (${res.status})`);

            set((state) => ({
                groups: [...state.groups, newGroup],
                activeContext: newGroup.id,
            }));
            return newGroup;
        } catch (error) {
            console.error("Error creating group:", error);
            set({ error: "Error al crear grupo" });
        }
    },

    joinGroup: async (codeOrLink: string, userId?: string) => {
        set({ error: null });
        try {
            const cleanCode = codeOrLink.trim().toUpperCase();
            const res = await fetch("/api/groups/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: cleanCode, userId }),
            });
            const joinedGroup = (await res.json()) as FamilyGroup;
            if (!res.ok) throw new Error(`Request failed (${res.status})`);

            set((state) => ({
                groups: [...state.groups.filter((g) => g.id !== joinedGroup.id), joinedGroup],
                activeContext: joinedGroup.id,
            }));
            return joinedGroup;
        } catch (error) {
            console.error("Error joining group:", error);
            set({ error: "Error al unirse al grupo" });
        }
    },

    leaveGroup: async (groupId: string) => {
        set({ error: null });
        try {
            await fetch(`/api/groups/${groupId}/leave`, { method: "POST" });
            set((state) => ({
                groups: state.groups.filter((g) => g.id !== groupId),
                activeContext: state.activeContext === groupId ? "personal" : state.activeContext,
            }));
        } catch (error) {
            console.error("Error leaving group:", error);
            set({ error: "Error al salir del grupo" });
        }
    },
}));