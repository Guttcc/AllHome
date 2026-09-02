import { useLanguage } from "@/lib/i18n";
import { useGroceryStore } from "@/store/grocery-store";
import { FontAwesome6 } from "@expo/vector-icons";
import { Text, View } from "react-native";


const TotalPriceCard = () => {
    const { items, activeContext } = useGroceryStore();
    const { t, locale } = useLanguage();

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

    // Si ningún producto tiene precio todavía, no mostramos la tarjeta
    if (itemsWithPrice.length === 0) {
        return null;
    }

    const formattedTotal = new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-US", {
        style: "currency",
        currency: "EUR",
    }).format(total);

    const missingCount = pendingItems.length - itemsWithPrice.length;

    return (
        <View className="flex-row items-center justify-between rounded-3xl border border-border bg-card p-4">
            <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-2xl bg-primary/15">
                    <FontAwesome6 name="euro-sign" size={16} color="#2f6b4f" />
                </View>
                <View>
                    <Text className="text-xs font-semibold uppercase tracking-[1px] text-muted-foreground">
                        {t("list.estimatedTotal") || "Total estimado"}
                    </Text>
                    {missingCount > 0 && (
                        <Text className="mt-0.5 text-xs text-muted-foreground">
                            {itemsWithPrice.length} {t("list.of") || "de"} {pendingItems.length}{" "}
                            {t("list.itemsWithPrice") || "productos con precio"}
                        </Text>
                    )}
                </View>
            </View>

            <Text className="text-2xl font-bold text-foreground">{formattedTotal}</Text>
        </View>
    );
};

export default TotalPriceCard;