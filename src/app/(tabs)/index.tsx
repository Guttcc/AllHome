import PendingItemCard from "@/components/list/PendingItemCard";
import { useGroceryStore } from "@/store/grocery-store";
import { FlatList, Text, View } from "react-native";

import CompletedItems from "@/components/list/CompletedItems";
import ListHeroCard from "@/components/list/ListHeroCard";
import TabScreenBackground from "@/components/TabScreenBackground";
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

    return (
        <FlatList
            className="flex-1 bg-background"
            data={pendingItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PendingItemCard item={item} />}
            contentContainerStyle={{ padding: 20, gap: 14 }}
            contentInsetAdjustmentBehavior="automatic"
            ListHeaderComponent={
                <View style={{ gap: 14, paddingTop: 20 }}>
                    <TabScreenBackground />
                    <ListHeroCard />
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