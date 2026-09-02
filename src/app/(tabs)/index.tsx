import PendingItemCard from "@/components/list/PendingItemCard";
import { useGroceryStore } from "@/store/grocery-store";
import { FlatList, Text, View } from "react-native";

import CompletedItems from "@/components/list/CompletedItems";
import ListHeroCard from "@/components/list/ListHeroCard";
import TabScreenBackground from "@/components/TabScreenBackground";
import TotalPriceCard from "@/components/total-price/TotalPriceCard";
import { groupItemsByCategory, ItemGroup, UNCATEGORIZED_KEY } from "@/lib/groupItems";
import { useLanguage } from "@/lib/i18n";

export default function ListScreen() {
    const { items, activeContext } = useGroceryStore();
    const { t } = useLanguage();

    const contextItems = items.filter((item) => {
        if (activeContext === "personal") {
            return !item.groupId; 
        }
        return item.groupId === activeContext; 
    });

    const pendingItems = contextItems.filter((item) => !item.purchased);

    const uncategorizedLabel = t("categories.none") || "Sin categoría";
    const groups = groupItemsByCategory(pendingItems, uncategorizedLabel);

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
                    <TotalPriceCard />
                    <View className="flex-row items-center justify-between px-1">
                        <Text className="text-sm font-semibold uppercase tracking-[1px] text-muted-foreground">
                            {t("planner.shoppingItems")}
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                            {pendingItems.length} {t("status.active")}
                        </Text>
                    </View>
                </View>
            }
            ListFooterComponent={<CompletedItems />}
        />
    );
}