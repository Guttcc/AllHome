import { calculateContextTotal } from "@/lib/calculateTotal";
import { useLanguage } from "@/lib/i18n";
import { useGroceryStore } from "@/store/grocery-store";
import { FontAwesome6 } from "@expo/vector-icons";
import { Text, View } from "react-native";

const TotalPriceCard = () => {
    const { items, activeContext } = useGroceryStore();
    const { t, locale } = useLanguage();

    const { total, pendingCount, itemsWithPriceCount } = calculateContextTotal(items, activeContext);

    if (itemsWithPriceCount === 0) {
        return null;
    }

    const formattedTotal = new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-US", {
        style: "currency",
        currency: "EUR",
    }).format(total);

    const missingCount = pendingCount - itemsWithPriceCount;

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
                            {itemsWithPriceCount} {t("list.of") || "de"} {pendingCount}{" "}
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