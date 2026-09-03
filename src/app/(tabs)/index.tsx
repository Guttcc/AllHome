import PendingItemCard from "@/components/list/PendingItemCard";
import { useGroceryStore } from "@/store/grocery-store";
import { FontAwesome6 } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";

import CompletedItems from "@/components/list/CompletedItems";
import ListHeroCard from "@/components/list/ListHeroCard";
import TabScreenBackground from "@/components/TabScreenBackground";
import TotalPriceCard from "@/components/total-price/TotalPriceCard";
import { groupItemsByCategory, ItemGroup, UNCATEGORIZED_KEY } from "@/lib/groupItems";
import { useLanguage } from "@/lib/i18n";

export default function ListScreen() {
    const { items, activeContext } = useGroceryStore();
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState("");

    const contextItems = items.filter((item) => {
        if (activeContext === "personal") {
            return !item.groupId; // Muestra solo ítems sin grupo
        }
        return item.groupId === activeContext; // Muestra ítems del grupo seleccionado
    });

    const pendingItems = contextItems.filter((item) => !item.purchased);

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredPendingItems = normalizedQuery
        ? pendingItems.filter((item) => {
              const nameMatch = item.name.toLowerCase().includes(normalizedQuery);
              const categoryMatch = item.category?.toLowerCase().includes(normalizedQuery) ?? false;
              return nameMatch || categoryMatch;
          })
        : pendingItems;

    const uncategorizedLabel = t("categories.none") || "Sin categoría";
    const groups = groupItemsByCategory(filteredPendingItems, uncategorizedLabel);

    const hasNoResults = normalizedQuery.length > 0 && groups.length === 0;

    return (
        <FlatList
            className="flex-1 bg-background"
            data={groups}
            keyExtractor={(group) => group.key}
            renderItem={({ item: group }: { item: ItemGroup }) => (
                <View className="gap-3">
                    <View className="flex-row items-center justify-between px-1">
                        <Text
                            className={`text-sm font-bold uppercase tracking-[1px] ${
                                group.key === UNCATEGORIZED_KEY ? "text-muted-foreground" : "text-foreground"
                            }`}
                        >
                            {group.label}
                        </Text>
                        <Text className="text-xs text-muted-foreground">
                            {group.items.length} {t("status.active")}
                        </Text>
                    </View>

                    <View style={{ gap: 10 }}>
                        {group.items.map((item) => (
                            <PendingItemCard key={item.id} item={item} />
                        ))}
                    </View>
                </View>
            )}
            contentContainerStyle={{ padding: 20, gap: 20 }}
            contentInsetAdjustmentBehavior="automatic"
            ListHeaderComponent={
                <View style={{ gap: 14, paddingTop: 20 }}>
                    <TabScreenBackground />
                    <ListHeroCard />

                    {/* BARRA DE BÚSQUEDA (minimalista, sin fondo ni caja) */}
                    <View className="flex-row items-center gap-2 border-b border-border/50 px-1 pb-2">
                        <FontAwesome6 name="magnifying-glass" size={14} color="#5b7567" />
                        <TextInput
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder={t("list.searchPlaceholder") || "Buscar producto o categoría..."}
                            placeholderTextColor="#8aa397"
                            className="flex-1 text-base text-foreground"
                        />
                        {searchQuery.length > 0 && (
                            <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
                                <FontAwesome6 name="xmark" size={16} color="#8aa397" />
                            </Pressable>
                        )}
                    </View>

                    <TotalPriceCard />

                    <View className="flex-row items-center justify-between px-1">
                        <Text className="text-sm font-semibold uppercase tracking-[1px] text-muted-foreground">
                            {t("planner.shoppingItems")}
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                            {filteredPendingItems.length} {t("status.active")}
                        </Text>
                    </View>
                </View>
            }
            ListEmptyComponent={
                hasNoResults ? (
                    <View className="items-center py-10">
                        <FontAwesome6 name="magnifying-glass" size={22} color="#8aa397" />
                        <Text className="mt-3 text-sm text-muted-foreground">
                            {t("list.noResults") || "No se encontraron resultados"}
                        </Text>
                    </View>
                ) : null
            }
            ListFooterComponent={<CompletedItems />}
        />
    );
}