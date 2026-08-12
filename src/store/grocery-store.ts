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
    activeContext: "personal" | string;
    isLoading: boolean;
    error: string | null;

    loadItems: (userId?: string) => Promise<void>;
    addItem: (input: CreateItemInput, userId?: string) => Promise<GroceryItem | void>;
    updateQuantity: (id: string, quantity: number, userId?: string) => Promise<void>;
    togglePurchased: (id: string, userId?: string) => Promise<void>;
    removeItem: (id: string, userId?: string) => Promise<void>;
    clearPurchased: (userId?: string) => Promise<void>;

    setActiveContext: (context: "personal" | string) => void;
    switchUser: (userId?: string) => Promise<void>;
    createGroup: (name: string, userId?: string) => Promise<FamilyGroup | void>;
    joinGroup: (codeOrLink: string, userId?: string) => Promise<FamilyGroup | void>;
    leaveGroup: (groupId: string, userId?: string) => Promise<void>;
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

    switchUser: async (userId?: string) => {
        set({ items: [], groups: [], activeContext: "personal", error: null, isLoading: true });
        try {
            if (userId) {
                // 1. Cargar los grupos del usuario actual
                const groupsRes = await fetch("/api/groups", {
                    headers: { "x-user-id": userId },
                });
                let userGroups: FamilyGroup[] = [];
                if (groupsRes.ok) {
                    userGroups = await groupsRes.json();
                }

                // 2. Cargar los ítems del usuario actual
                const itemsRes = await fetch("/api/items", {
                    headers: { "x-user-id": userId },
                });
                let userItems: GroceryItem[] = [];
                if (itemsRes.ok) {
                    const payload = (await itemsRes.json()) as ItemsResponse;
                    userItems = payload.items;
                }

                set({ groups: userGroups, items: userItems });
            }
        } catch (error) {
            console.error("Error switching user state:", error);
            set({ error: "Error al cambiar de cuenta" });
        } finally {
            set({ isLoading: false });
        }
    },

    loadItems: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch("/api/items", {
                headers: {
                    ...(userId ? { "x-user-id": userId } : {}),
                },
            });
            if (!res.ok) throw new Error(`Request failed (${res.status})`);

            const payload = (await res.json()) as ItemsResponse;
            set({ items: payload.items });
        } catch (error) {
            console.error("Error loading items:", error);
            set({ error: "Something went wrong" });
        } finally {
            set({ isLoading: false });
        }
    },

    addItem: async (input, userId) => {
        set({ error: null });
        try {
            const targetGroupId = input.groupId !== undefined
                ? input.groupId
                : (get().activeContext === "personal" ? null : get().activeContext);

            const headers: Record<string, string> = {
                "Content-Type": "application/json",
            };
            if (userId) {
                headers["x-user-id"] = userId;
            }

            const res = await fetch("/api/items", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    name: input.name,
                    category: input.category,
                    quantity: Math.max(1, input.quantity),
                    priority: input.priority,
                    groupId: targetGroupId,
                    createdByName: input.createdByName ?? null,
                    userId: userId ?? null,
                }),
            });

            if (!res.ok) throw new Error(`Request failed (${res.status})`);
            const payload = (await res.json()) as ItemResponse;

            set((state) => ({ items: [payload.item, ...state.items] }));
            return payload.item;
        } catch (error) {
            console.error("Error adding item:", error);
            set({ error: "Something went wrong" });
        }
    },

    updateQuantity: async (id, quantity, userId) => {
        const nextQuantity = Math.max(1, quantity);
        set({ error: null });

        try {
            const res = await fetch(`/api/items/${id}`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    ...(userId ? { "x-user-id": userId } : {}),
                },
                body: JSON.stringify({ quantity: nextQuantity }),
            });

            if (!res.ok) throw new Error(`Request failed (${res.status})`);
            const payload = (await res.json()) as ItemResponse;

            set((state) => ({
                items: state.items.map((item) => (item.id === id ? payload.item : item)),
            }));
        } catch (error) {
            console.error("Error updating quantity:", error);
            set({ error: "Something went wrong" });
        }
    },

    togglePurchased: async (id, userId) => {
        const currentItem = get().items.find((item) => item.id === id);
        if (!currentItem) return;

        const nextPurchased = !currentItem.purchased;
        set({ error: null });
        try {
            const res = await fetch(`/api/items/${id}`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    ...(userId ? { "x-user-id": userId } : {}),
                },
                body: JSON.stringify({ purchased: nextPurchased }),
            });

            if (!res.ok) throw new Error(`Request failed (${res.status})`);
            const payload = (await res.json()) as ItemResponse;

            set((state) => ({
                items: state.items.map((item) => (item.id === id ? payload.item : item)),
            }));
        } catch (error) {
            console.error("Error toggling purchased:", error);
            set({ error: "Something went wrong" });
        }
    },

    removeItem: async (id, userId) => {
        set({ error: null });
        try {
            const res = await fetch(`/api/items/${id}`, { 
                method: "DELETE",
                headers: {
                    ...(userId ? { "x-user-id": userId } : {}),
                },
            });
            if (!res.ok) throw new Error(`Request failed (${res.status})`);

            set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
        } catch (error) {
            console.error("Error removing item:", error);
            set({ error: "Something went wrong" });
        }
    },

    clearPurchased: async (userId) => {
        set({ error: null });
        try {
            const res = await fetch("/api/items/clear-purchased", { 
                method: "POST",
                headers: {
                    ...(userId ? { "x-user-id": userId } : {}),
                },
            });
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
                headers: { 
                    "Content-Type": "application/json",
                    ...(userId ? { "x-user-id": userId } : {}),
                },
                body: JSON.stringify({ name, userId }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Request failed (${res.status}): ${errorText}`);
            }

            const newGroup = (await res.json()) as FamilyGroup;

            set((state) => ({
                groups: [...state.groups, newGroup],
                activeContext: newGroup.id,
            }));

            if (userId) {
                await get().loadItems(userId);
            }

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
                headers: { 
                    "Content-Type": "application/json",
                    ...(userId ? { "x-user-id": userId } : {}),
                },
                body: JSON.stringify({ code: cleanCode, userId }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Request failed (${res.status}): ${errorText}`);
            }

            const joinedGroup = (await res.json()) as FamilyGroup;

            set((state) => ({
                groups: [...state.groups.filter((g) => g.id !== joinedGroup.id), joinedGroup],
                activeContext: joinedGroup.id,
            }));

            if (userId) {
                await get().loadItems(userId);
            }

            return joinedGroup;
        } catch (error) {
            console.error("Error joining group:", error);
            set({ error: "Error al unirse al grupo" });
        }
    },

    leaveGroup: async (groupId: string, userId?: string) => {
        set({ error: null });
        try {
            const res = await fetch(`/api/groups/${groupId}/leave`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    ...(userId ? { "x-user-id": userId } : {}),
                },
                body: JSON.stringify({ userId }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Request failed (${res.status}): ${errorText}`);
            }

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